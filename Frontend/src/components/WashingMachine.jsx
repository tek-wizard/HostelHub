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
                    return '#4CAF50'; // Green
                case 'occupied':
                    return '#F44336'; // Red
                default:
                    console.warn(`Unknown machine status: ${machine.status}`);
                    return '#9E9E9E'; // Gray
            }
        } catch (error) {
            console.error('Error determining status color:', error);
            return '#9E9E9E';
        }
    };

    const getStatusText = () => {
        try {
            switch (machine.status) {
                case 'available':
                    return 'Available';
                case 'occupied':
                    return 'In Use';
                default:
                    console.warn(`Unknown machine status: ${machine.status}`);
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
                    return `${remainingMinutes} min left`;
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

    if (!machine) {
        console.error('WashingMachine component received null or undefined machine prop');
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                margin: '15px',
                border: '2px dashed #F44336',
                borderRadius: '10px',
                color: '#F44336',
                background: '#ffebee',
                minWidth: '250px',
                fontWeight: '500'
            }}>
                Machine data not available
            </div>
        );
    }

    const statusColor = getStatusColor();

    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                margin: '15px',
                border: `3px solid ${statusColor}`,
                borderRadius: '15px',
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '250px',
                maxWidth: '300px'
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
            }}
        >
            {/* Machine Icon */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    border: `8px solid ${statusColor}`,
                    borderRadius: '50%',
                    background: '#f8f8f8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Machine Door */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        border: '4px solid #ddd',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #e0e0e0, #f5f5f5)',
                        position: 'absolute'
                    }}></div>
                    
                    {/* Machine Number */}
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: statusColor,
                        zIndex: 1,
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                        {machine.machineNumber}
                    </div>
                </div>
            </div>
            
            {/* Machine Info */}
            <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    color: '#333',
                    fontWeight: '600'
                }}>
                    Machine {machine.machineNumber}
                </h3>
                
                <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: statusColor,
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {getStatusText()}
                </div>
                
                {machine.status === 'occupied' && machine.session && (
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginTop: '10px'
                    }}>
                        <p style={{
                            margin: '4px 0',
                            fontSize: '13px',
                            color: '#333',
                            fontWeight: '500'
                        }}>
                            User: {machine.session.name}
                        </p>
                        <p style={{
                            margin: '4px 0',
                            fontSize: '14px',
                            color: statusColor,
                            fontWeight: '600'
                        }}>
                            {getRemainingTime()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WashingMachine; 