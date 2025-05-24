import React, { useState, useEffect } from 'react';
import { sessionAPI } from './services/api';
import WashingMachine from './components/WashingMachine';
import MachineModal from './components/MachineModal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Generate 30 machines with floor assignments
  const generateMachines = (backendMachines, allSessions = []) => {
    const generatedMachines = [];
    
    for (let i = 1; i <= 30; i++) {
      const floor = Math.ceil(i / 6); // 6 machines per floor
      const machineOnFloor = ((i - 1) % 6) + 1;
      
      // Check if we have backend data for this machine number
      const backendMachine = backendMachines.find(m => m.machineNumber === i);
      
      // Check if there's an active session for this machine number
      const activeSession = allSessions.find(session => 
        session.machineNumber === i && session.isActive !== false
      );
      
      if (backendMachine) {
        // Use backend data if available (machines 1-5 typically)
        generatedMachines.push({
          ...backendMachine,
          floor: floor,
          location: `Floor ${floor} - Position ${machineOnFloor}`
        });
      } else {
        // Generate machine for numbers 6-30, but check for active sessions
        let status = 'available';
        let sessionData = null;
        
        if (activeSession) {
          // Check if session is expired to determine status
          const endTime = new Date(activeSession.startTime).getTime() + (activeSession.duration * 60000);
          const now = new Date().getTime();
          
          if (now < endTime) {
            status = 'occupied';
          } else {
            status = 'waiting_pickup';
          }
          
          sessionData = {
            id: activeSession._id,
            name: activeSession.name,
            phoneNumber: activeSession.phoneNumber,
            startTime: activeSession.startTime,
            duration: activeSession.duration,
            endTime: new Date(endTime)
          };
        }
        
        generatedMachines.push({
          machineNumber: i,
          floor: floor,
          location: `Floor ${floor} - Position ${machineOnFloor}`,
          status: status,
          session: sessionData,
          isActive: true
        });
      }
    }
    
    return generatedMachines;
  };

  // Fetch machine status from backend
  const fetchMachineStatus = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Fetch both machine status and all sessions
      const [machineResponse, sessionResponse] = await Promise.all([
        sessionAPI.getMachineStatus(),
        sessionAPI.getAllSessions()
      ]);
      
      // Generate 30 machines using backend data where available
      const allMachines = generateMachines(
        machineResponse.data?.machines || [], 
        sessionResponse.data?.sessions || []
      );
      setMachines(allMachines);
      setError('');
    } catch (err) {
      setError(`Failed to load machine status: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMachineStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMachineStatus(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle machine click
  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  // Handle booking a machine
  const handleBookMachine = async (sessionData) => {
    const response = await sessionAPI.createSession(sessionData);
    if (response.data) {
      await fetchMachineStatus(true);
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId) => {
    const response = await sessionAPI.deleteSession(sessionId);
    if (response.data) {
      await fetchMachineStatus(true);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMachine(null);
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchMachineStatus(true);
  };

  // Handle floor selection
  const handleFloorSelection = (floor) => {
    setSelectedFloor(floor);
    setIsMobileSidebarOpen(false); // Close mobile dropdown when floor is selected
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Filter machines by selected floor
  const getFloorMachines = () => {
    return machines.filter(machine => machine.floor === selectedFloor);
  };

  // Get status summary for selected floor
  const getFloorSummary = (floor) => {
    const floorMachines = machines.filter(m => m.floor === floor);
    const available = floorMachines.filter(m => m.status === 'available').length;
    const occupied = floorMachines.filter(m => m.status === 'occupied').length;
    const waitingPickup = floorMachines.filter(m => m.status === 'waiting_pickup').length;
    return { available, occupied, waitingPickup, total: floorMachines.length };
  };

  // Get overall status summary
  const getOverallSummary = () => {
    const available = machines.filter(m => m.status === 'available').length;
    const occupied = machines.filter(m => m.status === 'occupied').length;
    const waitingPickup = machines.filter(m => m.status === 'waiting_pickup').length;
    return { available, occupied, waitingPickup, total: machines.length };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="spinner"></div>
          <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '12px'}}>Loading HostelHub</h2>
          <p style={{color: 'var(--color-text-secondary)'}}>Connecting to washing machines...</p>
        </div>
      </div>
    );
  }

  const floorMachines = getFloorMachines();
  const overallSummary = getOverallSummary();

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        overallSummary={overallSummary}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar
          selectedFloor={selectedFloor}
          onFloorSelection={handleFloorSelection}
          getFloorSummary={getFloorSummary}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={toggleMobileSidebar}
        />

        {/* Main Content */}
        <main className="main-content">
          {/* Floor Header */}
          <div className="floor-header">
            <h2>Floor {selectedFloor}</h2>
            <p>{floorMachines.length} washing machines</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-card">
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)'}}>
                <div>
                  <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div style={{flex: '1'}}>
                  <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: 'var(--spacing-xs)'}}>Connection Error</h3>
                  <p style={{marginBottom: 'var(--spacing-md)'}}>{error}</p>
                  <button onClick={handleRefresh} className="btn btn-danger">
                    <svg style={{width: '14px', height: '14px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Machines Grid */}
          {floorMachines.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize: '48px', marginBottom: 'var(--spacing-md)'}}>🧺</div>
              <h3>No Machines on This Floor</h3>
              <p>There are no washing machines available on Floor {selectedFloor}.</p>
            </div>
          ) : (
            <div className="machines-grid">
              {floorMachines.map((machine, index) => (
                <div
                  key={machine.machineNumber}
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <WashingMachine
                    machine={machine}
                    onClick={handleMachineClick}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMachine && (
        <MachineModal
          machine={selectedMachine}
          onClose={handleModalClose}
          onBookMachine={handleBookMachine}
          onDeleteSession={handleDeleteSession}
        />
      )}
    </div>
  );
}

export default App;
