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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <h2>Loading HostelHub...</h2>
          <p>Fetching washing machine status...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>HostelHub</h1>
        <p style={{ color: '#666', margin: '0 0 20px 0' }}>Washing Machine Management System</p>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            background: refreshing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: refreshing ? 'not-allowed' : 'pointer'
          }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#ffe6e6',
          border: '1px solid #ff0000',
          color: '#cc0000',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <strong>Error:</strong> {error}
          <br />
          <button 
            onClick={handleRefresh}
            style={{
              background: '#cc0000',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Machines Display */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {machines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No machines available</h3>
            <p>No washing machines found in the system.</p>
          </div>
        ) : (
          machines.map((machine) => (
            <WashingMachine
              key={machine.machineNumber}
              machine={machine}
              onClick={handleMachineClick}
            />
          ))
        )}
      </div>

      {/* Debug Info */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Debug Information:</h3>
        <p><strong>Total Machines:</strong> {machines.length}</p>
        <p><strong>Backend Status:</strong> {error ? 'Error' : 'Connected'}</p>
        <p><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</p>
        
        <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Machine Data (JSON)</summary>
          <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(machines, null, 2)}
          </pre>
        </details>
      </div>

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
