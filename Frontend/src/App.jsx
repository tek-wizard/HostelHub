import React, { useState, useEffect } from 'react';
import { sessionAPI } from './services/api';
import WashingMachine from './components/WashingMachine';
import MachineModal from './components/MachineModal';
import './App.css';

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
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '20px' }}>Loading HostelHub</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Fetching washing machine data...</p>
        </div>
      </div>
    );
  }

  const summary = getStatusSummary();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '20px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              color: '#333',
              margin: '0 0 5px 0',
              fontSize: '28px',
              fontWeight: '600'
            }}>
              HostelHub - Washing Machine Management
            </h1>
            <p style={{
              color: '#666',
              margin: 0,
              fontSize: '14px'
            }}>
              Real-time machine status and booking system
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Status Summary */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Available: {summary.available}
              </div>
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                In Use: {summary.occupied}
              </div>
              <div style={{
                background: '#fff3cd',
                color: '#856404',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Waiting Pickup: {summary.waitingPickup}
              </div>
              <div style={{
                background: '#d1ecf1',
                color: '#0c5460',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Total: {summary.total}
              </div>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                background: refreshing ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Error Display */}
        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '5px' }}>
              Connection Error
            </div>
            <div style={{ marginBottom: '10px' }}>{error}</div>
            <button 
              onClick={handleRefresh}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Machines Grid */}
        {machines.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px 40px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🧺</div>
            <h3 style={{ color: '#333', fontSize: '20px', marginBottom: '10px' }}>No Machines Available</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>No washing machines found in the system.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {machines.map((machine) => (
              <WashingMachine
                key={machine.machineNumber}
                machine={machine}
                onClick={handleMachineClick}
              />
            ))}
          </div>
        )}

        {/* System Info Footer */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '30px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                System Status
              </div>
              <div style={{ 
                color: error ? '#dc3545' : '#28a745', 
                fontSize: '14px', 
                fontWeight: '500' 
              }}>
                {error ? 'Offline' : 'Online'}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                Last Updated
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                Auto Refresh
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Every 30 seconds
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <MachineModal
        machine={selectedMachine}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onBook={handleBookMachine}
        onDelete={handleDeleteSession}
      />
    </div>
  );
}

export default App;
