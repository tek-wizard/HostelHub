import React from 'react';

const WashingMachine = ({ machine, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(machine);
        }
    };

    const getStatusText = () => {
        switch (machine.status) {
            case 'available':
                return 'AVAILABLE';
            case 'occupied':
                return 'IN USE';
            case 'waiting_pickup':
                return 'WAITING PICKUP';
            default:
                return 'UNKNOWN';
        }
    };

    const getRemainingTime = () => {
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
    };

    const getWaitingTime = () => {
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
    };

    if (!machine) {
        return (
            <div className="washing-machine-card" style={{backgroundColor: '#fef2f2', border: '2px dashed #f87171'}}>
                <div style={{textAlign: 'center', color: '#dc2626'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
                    <div style={{fontSize: '16px', fontWeight: '600'}}>Machine data not available</div>
                </div>
            </div>
        );
    }

    const statusText = getStatusText();
    const remainingTime = getRemainingTime();
    const waitingTime = getWaitingTime();

    return (
        <div className="washing-machine-card" onClick={handleClick}>
            <div className={`status-header status-${machine.status}`}>
                {statusText}
            </div>

            <div className="machine-visual">
                <div className={`machine-circle ${machine.status}`}>
                    {machine.machineNumber}
                </div>
            </div>

            <div className="machine-details">
                {machine.location && (
                    <div className="detail-row">
                        <span className="detail-label">LOCATION</span>
                        <span className="detail-value">{machine.location}</span>
                    </div>
                )}

                {machine.session && (
                    <div className="session-info">
                        <div className="session-title">Active Session</div>
                        
                        {machine.session.userName && (
                            <div className="detail-row">
                                <span className="detail-label">User:</span>
                                <span className="detail-value">{machine.session.userName}</span>
                            </div>
                        )}

                        {machine.session.startTime && (
                            <div className="detail-row">
                                <span className="detail-label">Started:</span>
                                <span className="detail-value">
                                    {new Date(machine.session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        )}

                        {remainingTime && (
                            <div className={`remaining-time ${remainingTime.includes('expired') ? 'expired' : ''}`}>
                                {remainingTime}
                            </div>
                        )}

                        {waitingTime && (
                            <div className="waiting-time">
                                {waitingTime}
                            </div>
                        )}
                    </div>
                )}

                {machine.status === 'available' && (
                    <div className="ready-to-use">
                        ✨ Ready to Use!
                        <div style={{marginTop: '4px', opacity: 0.9}}>
                            Click to book this machine
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WashingMachine; 