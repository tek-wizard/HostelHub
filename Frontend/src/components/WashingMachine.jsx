import React from 'react';

const WashingMachine = ({ machine, onClick }) => {
    const handleClick = () => {
        try {
            console.log(`Machine ${machine.machineNumber} clicked, status: ${machine.status}`);
            if (onClick) {
                onClick(machine);
            }
        } catch (error) {
            console.error('Error handling machine click:', error);
        }
    };

    const getStatusColor = () => {
        try {
            switch (machine.status) {
                case 'available':
                    return '#28a745';
                case 'occupied':
                    return '#dc3545';
                case 'waiting_pickup':
                    return '#ffc107'; // Yellow for waiting
                default:
                    return '#6c757d';
            }
        } catch (error) {
            console.error('Error determining status color:', error);
            return '#6c757d';
        }
    };

    const getStatusText = () => {
        try {
            switch (machine.status) {
                case 'available':
                    return 'Available';
                case 'occupied':
                    return 'In Use';
                case 'waiting_pickup':
                    return 'Waiting Pickup';
                default:
                    return 'Unknown';
            }
        } catch (error) {
            console.error('Error determining status text:', error);
            return 'Error';
        }
    };

    const getRemainingTime = () => {
        try {
            if (machine.status === 'occupied' && machine.session) {
                const endTime = new Date(machine.session.endTime);
                const now = new Date();
                const remainingMs = endTime - now;
                
                if (remainingMs > 0) {
                    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
                    const hours = Math.floor(remainingMinutes / 60);
                    const mins = remainingMinutes % 60;
                    
                    if (hours > 0) {
                        return `${hours}h ${mins}m remaining`;
                    }
                    return `${remainingMinutes}m remaining`;
                } else {
                    return 'Time expired';
                }
            }
            return null;
        } catch (error) {
            console.error('Error calculating remaining time:', error);
            return 'Time error';
        }
    };

    const getWaitingTime = () => {
        try {
            if (machine.status === 'waiting_pickup' && machine.session) {
                const endTime = new Date(machine.session.endTime);
                const now = new Date();
                const waitingMs = now - endTime;
                
                if (waitingMs > 0) {
                    const waitingMinutes = Math.floor(waitingMs / (1000 * 60));
                    const hours = Math.floor(waitingMinutes / 60);
                    const mins = waitingMinutes % 60;
                    
                    if (hours > 0) {
                        return `Waiting ${hours}h ${mins}m`;
                    }
                    return `Waiting ${waitingMinutes}m`;
                } else {
                    return 'Just finished';
                }
            }
            return null;
        } catch (error) {
            console.error('Error calculating waiting time:', error);
            return 'Time error';
        }
    };

    if (!machine) {
        console.error('WashingMachine component received null or undefined machine prop');
        return (
            <div style={{
                background: 'white',
                border: '2px dashed #dc3545',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                color: '#dc3545',
                fontSize: '14px',
                fontWeight: '500'
            }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                Machine data not available
            </div>
        );
    }

    const statusColor = getStatusColor();

    return (
        <div 
            style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(0)';
            }}
        >
            {/* Header with Status */}
            <div style={{
                background: statusColor,
                color: 'white',
                padding: '15px 20px',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600'
                }}>
                    Machine {machine.machineNumber}
                </h3>
                <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                }}>
                    {getStatusText()}
                </span>
            </div>

            {/* Machine Details */}
            <div style={{ padding: '20px' }}>
                {/* Machine Information Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '15px'
                }}>
                    {machine.name && (
                        <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '500' }}>
                                Name
                            </div>
                            <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                {machine.name}
                            </div>
                        </div>
                    )}

                    {machine.location && (
                        <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '500' }}>
                                Location
                            </div>
                            <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                {machine.location}
                            </div>
                        </div>
                    )}

                    {machine.capacity && (
                        <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '500' }}>
                                Capacity
                            </div>
                            <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                {machine.capacity}
                            </div>
                        </div>
                    )}

                    {machine.lastMaintenance && (
                        <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '500' }}>
                                Last Maintenance
                            </div>
                            <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                {new Date(machine.lastMaintenance).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Session Information for Occupied */}
                {machine.status === 'occupied' && machine.session && (
                    <div style={{
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                        border: '1px solid #e9ecef',
                        marginTop: '15px'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginBottom: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            Current Session
                        </div>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            marginBottom: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                    User
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
                                    {machine.session.name}
                                </div>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                    Phone
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
                                    {machine.session.phoneNumber}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                    Duration
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
                                    {machine.session.duration} minutes
                                </div>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                    Time Left
                                </div>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: statusColor, 
                                    fontWeight: '600' 
                                }}>
                                    {getRemainingTime()}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                Started At
                            </div>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
                                {new Date(machine.session.startTime).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Waiting Pickup Information */}
                {machine.status === 'waiting_pickup' && machine.session && (
                    <div style={{
                        background: '#fff3cd',
                        padding: '15px',
                        borderRadius: '6px',
                        border: '2px solid #ffc107',
                        marginTop: '15px'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: '#856404',
                            marginBottom: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            textAlign: 'center'
                        }}>
                            🧺 Clothes Ready for Pickup
                        </div>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            marginBottom: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>
                                    Owner
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>
                                    {machine.session.name}
                                </div>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>
                                    Phone
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>
                                    {machine.session.phoneNumber}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            marginBottom: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>
                                    Finished At
                                </div>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
                                    {new Date(machine.session.endTime).toLocaleString()}
                                </div>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>
                                    Waiting Time
                                </div>
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#856404', 
                                    fontWeight: '600' 
                                }}>
                                    {getWaitingTime()}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: '#ffeaa7',
                            padding: '10px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}>
                            <div style={{ fontSize: '14px', color: '#856404', fontWeight: '600' }}>
                                Click to pickup clothes or call user
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Call to Action */}
                {machine.status === 'available' && (
                    <div style={{
                        background: '#d4edda',
                        color: '#155724',
                        padding: '12px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        marginTop: '15px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Click to book this machine
                    </div>
                )}

                {/* Machine Status Info */}
                <div style={{
                    borderTop: '1px solid #e9ecef',
                    paddingTop: '15px',
                    marginTop: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                            Status
                        </div>
                        <div style={{ 
                            fontSize: '13px', 
                            color: statusColor, 
                            fontWeight: '600' 
                        }}>
                            {getStatusText()}
                        </div>
                    </div>
                    
                    {machine.isActive !== undefined && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                                Machine Status
                            </div>
                            <div style={{ 
                                fontSize: '13px', 
                                color: machine.isActive ? '#28a745' : '#dc3545',
                                fontWeight: '600'
                            }}>
                                {machine.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WashingMachine; 