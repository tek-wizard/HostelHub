import React, { useState, useEffect } from 'react';
import { sessionAPI } from './services/api';
import WashingMachine from './components/WashingMachine';
import MachineModal from './components/MachineModal';

function App() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch machine status from backend
  const fetchMachineStatus = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Fetching machine status from backend...');
      const data = await sessionAPI.getMachineStatus();
      
      console.log('Machine status fetched successfully:', data.machines);
      setMachines(data.machines || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch machine status:', err);
      setError(`Failed to load machine status: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log('App component mounted, fetching initial data...');
    fetchMachineStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMachineStatus(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle machine click
  const handleMachineClick = (machine) => {
    try {
      console.log('Machine clicked:', machine);
      setSelectedMachine(machine);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error handling machine click:', err);
      setError('Error opening machine details');
    }
  };

  // Handle booking a machine
  const handleBookMachine = async (sessionData) => {
    try {
      console.log('Booking machine with data:', sessionData);
      await sessionAPI.createSession(sessionData);
      console.log('Machine booked successfully, refreshing data...');
      
      // Refresh machine status after booking
      await fetchMachineStatus(true);
    } catch (err) {
      console.error('Failed to book machine:', err);
      throw new Error(err.message || 'Failed to book machine');
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId) => {
    try {
      console.log('Deleting session:', sessionId);
      await sessionAPI.deleteSession(sessionId);
      console.log('Session deleted successfully, refreshing data...');
      
      // Refresh machine status after deletion
      await fetchMachineStatus(true);
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw new Error(err.message || 'Failed to delete session');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMachine(null);
  };

  // Manual refresh
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    fetchMachineStatus(true);
  };

  const getStatusSummary = () => {
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
          <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '12px'}}>Loading HostelHub</h2>
          <p style={{color: '#4a5568'}}>Connecting to washing machines...</p>
        </div>
      </div>
    );
  }

  const summary = getStatusSummary();

  return (
    <div style={{minHeight: '100vh'}}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {/* Logo and Title Section */}
          <div className="logo-section">
            <div className="logo">🏠</div>
            <div>
              <h1 className="app-title">HostelHub</h1>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568'}}>
                <span>Washing Machine Management</span>
                <div className="status-dot" style={{background: '#48bb78'}}></div>
                <span style={{color: '#38a169', fontWeight: '600'}}>Live</span>
              </div>
            </div>
          </div>

          {/* Status Summary and Controls */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end'}}>
            {/* Status Pills */}
            <div className="status-pills">
              <div className="status-pill available">
                <div className="status-dot" style={{background: '#38a169'}}></div>
                Available: {summary.available}
              </div>
              <div className="status-pill occupied">
                <div className="status-dot" style={{background: '#e53e3e'}}></div>
                In Use: {summary.occupied}
              </div>
              <div className="status-pill waiting">
                <div className="status-dot" style={{background: '#dd6b20'}}></div>
                Pickup: {summary.waitingPickup}
              </div>
              <div className="status-pill" style={{background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)'}}>
                <div className="status-dot" style={{background: '#667eea'}}></div>
                Total: {summary.total}
              </div>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className={refreshing ? 'btn' : 'btn btn-primary'}
              style={refreshing ? {opacity: 0.6, cursor: 'not-allowed'} : {}}
            >
              <svg 
                style={{width: '20px', height: '20px', animation: refreshing ? 'spin 1s linear infinite' : 'none'}}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Error Display */}
        {error && (
          <div className="error-card">
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
              <div>
                <svg style={{width: '24px', height: '24px', color: '#f56565'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{flex: '1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '700', color: '#991b1b', marginBottom: '8px'}}>Connection Error</h3>
                <p style={{color: '#b91c1c', marginBottom: '16px'}}>{error}</p>
                <button onClick={handleRefresh} className="btn btn-danger">
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Machines Grid */}
        {machines.length === 0 ? (
          <div style={{background: 'white', borderRadius: '20px', padding: '80px 40px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
            <div style={{fontSize: '64px', marginBottom: '24px'}}>🧺</div>
            <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px'}}>No Machines Available</h3>
            <p style={{color: '#4a5568', maxWidth: '400px', margin: '0 auto 24px'}}>
              No washing machines found in the system. Please check your connection or contact support.
            </p>
            <button onClick={handleRefresh} className="btn btn-primary">
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="machines-grid">
            {machines.map((machine, index) => (
              <div
                key={machine.machineNumber}
                style={{
                  animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`
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
