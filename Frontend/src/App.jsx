import React, { useState, useEffect } from 'react';
import { sessionAPI } from './services/api';
import WashingMachine from './components/WashingMachine';
import MachineModal from './components/MachineModal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { storage, isMobile } from './utils';

const TOTAL_MACHINES = 30;
const MACHINES_PER_FLOOR = 6;
const REFRESH_INTERVAL = 30000; // 30 seconds - could be configurable

function App() {
  // Main state - probably should organize this better at some point
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Use storage utility for persisting selected floor
  const [selectedFloor, setSelectedFloor] = useState(() => {
    return storage.get('hostelhub_selected_floor', 1);
  });
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Detect if user is on mobile for better UX
  const userIsMobile = isMobile();

  // Helper function to calculate which floor a machine is on
  const getFloorNumber = (machineNumber) => {
    return Math.ceil(machineNumber / MACHINES_PER_FLOOR);
  };

  // Generate machine data - this combines real backend data with generated ones
  // for demo purposes since we might not have all 30 machines in backend
  const generateMachines = (backendMachines, allSessions = []) => {
    const generatedMachines = [];
    
    for (let i = 1; i <= TOTAL_MACHINES; i++) {
      const floor = getFloorNumber(i);
      const positionOnFloor = ((i - 1) % MACHINES_PER_FLOOR) + 1;
      
      // Check if we have real data from backend for this machine
      const backendMachine = backendMachines.find(m => m.machineNumber === i);
      
      // Look for any active sessions for this machine
      const activeSession = allSessions.find(session => 
        session.machineNumber === i && session.isActive !== false
      );
      
      if (backendMachine) {
        // Use real backend data when available
        generatedMachines.push({
          ...backendMachine,
          floor: floor,
          location: `Floor ${floor} - Position ${positionOnFloor}`
        });
      } else {
        // Generate demo data for machines not in backend
        let status = 'available';
        let sessionData = null;
        
        if (activeSession) {
          // Figure out status based on session timing
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
          location: `Floor ${floor} - Position ${positionOnFloor}`,
          status: status,
          session: sessionData,
          isActive: true
        });
      }
    }
    
    return generatedMachines;
  };

  // Main function to fetch data from backend
  const fetchMachineStatus = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [machineData, sessionData] = await Promise.all([
        sessionAPI.getMachineStatus(),
        sessionAPI.getAllSessions()
      ]);
      
      const allMachines = generateMachines(
        machineData.machines || [], 
        sessionData.sessions || []
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

  // Set up initial data loading and auto-refresh
  useEffect(() => {
    fetchMachineStatus();
    
    const interval = setInterval(() => {
      fetchMachineStatus(true);
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Save selected floor to localStorage whenever it changes
  useEffect(() => {
    storage.set('hostelhub_selected_floor', selectedFloor);
  }, [selectedFloor]);

  // Handle machine click/selection
  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  // Handle machine booking
  const handleBookMachine = async (sessionData) => {
    try {
      await sessionAPI.createSession(sessionData);
      await fetchMachineStatus(true);
    } catch (err) {
      throw new Error(err.message || 'Failed to book machine');
    }
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionAPI.deleteSession(sessionId);
      await fetchMachineStatus(true);
    } catch (err) {
      throw new Error(err.message || 'Failed to delete session');
    }
  };

  // Close modal
  const handleModalClose = () => {
    setSelectedMachine(null);
    setIsModalOpen(false);
  };

  // Manual refresh button
  const handleRefresh = () => {
    fetchMachineStatus(true);
  };

  // Floor selection handling
  const handleFloorSelection = (floor) => {
    setSelectedFloor(floor);
    if (userIsMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Get machines for the currently selected floor
  const getFloorMachines = () => {
    return machines.filter(machine => machine.floor === selectedFloor);
  };

  // Get status summary for a specific floor
  const getFloorSummary = (floor) => {
    const floorMachines = machines.filter(m => m.floor === floor);
    const available = floorMachines.filter(m => m.status === 'available').length;
    const occupied = floorMachines.filter(m => m.status === 'occupied').length;
    const waiting = floorMachines.filter(m => m.status === 'waiting_pickup').length;
    return { available, occupied, waiting, total: floorMachines.length };
  };

  // Get overall summary across all machines
  const getOverallSummary = () => {
    const available = machines.filter(m => m.status === 'available').length;
    const occupied = machines.filter(m => m.status === 'occupied').length;
    const waiting = machines.filter(m => m.status === 'waiting_pickup').length;
    return { available, occupied, waiting, total: machines.length };
  };

  // Show loading screen while initial data loads
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading HostelHub</h2>
          <p>Fetching machine status...</p>
        </div>
      </div>
    );
  }

  if (error && machines.length === 0) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalFloors = Math.ceil(TOTAL_MACHINES / MACHINES_PER_FLOOR);
  const floorMachines = getFloorMachines();
  const overallSummary = getOverallSummary();

  return (
    <div className="app-container">
      {/* App Header */}
      <Header 
        summary={overallSummary}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onToggleSidebar={toggleMobileSidebar}
        isMobile={userIsMobile}
        error={error}
      />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Floor Navigation Sidebar */}
        <Sidebar
          selectedFloor={selectedFloor}
          onFloorSelect={handleFloorSelection}
          totalFloors={totalFloors}
          getFloorSummary={getFloorSummary}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          isMobile={userIsMobile}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {/* Floor Header */}
          <div className="floor-header">
            <h1>Floor {selectedFloor}</h1>
            <div className="floor-summary">
              {(() => {
                const summary = getFloorSummary(selectedFloor);
                return (
                  <div className="summary-stats">
                    <span className="stat available">{summary.available} Available</span>
                    <span className="stat occupied">{summary.occupied} In Use</span>
                    <span className="stat waiting">{summary.waiting} Pickup</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Machines Grid */}
          {floorMachines.length === 0 ? (
            <div className="empty-floor">
              <p>No machines found on this floor</p>
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
                    onClick={() => handleMachineClick(machine)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Machine Booking Modal */}
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
