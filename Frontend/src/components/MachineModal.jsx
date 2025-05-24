import React, { useState } from 'react';

const MachineModal = ({ machine, onClose, onBookMachine, onDeleteSession }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        duration: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (machine) {
            console.log('Modal opened for machine:', machine);
            setFormData({ name: '', phoneNumber: '', duration: '' });
            setError('');
        }
    }, [machine]);

    const handleInputChange = (e) => {
        try {
            const { name, value } = e.target;
            console.log(`Form input changed: ${name} = ${value}`);
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            
            // Clear error when user starts typing
            if (error) {
                setError('');
            }
        } catch (error) {
            console.error('Error handling input change:', error);
        }
    };

    const validateForm = () => {
        try {
            const errors = [];
            
            if (!formData.name.trim()) {
                errors.push('Name is required');
            }
            
            if (!formData.phoneNumber.trim()) {
                errors.push('Phone number is required');
            } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
                errors.push('Please enter a valid 10-digit phone number');
            }
            
            if (!formData.duration) {
                errors.push('Duration is required');
            } else {
                const duration = parseInt(formData.duration);
                if (isNaN(duration) || duration < 1 || duration > 180) {
                    errors.push('Duration must be between 1 and 180 minutes');
                }
            }

            return errors;
        } catch (error) {
            console.error('Error validating form:', error);
            return ['Form validation error'];
        }
    };

    const handleBookMachine = async () => {
        try {
            console.log('Attempting to book machine with data:', formData);
            setIsLoading(true);
            setError('');

            const validationErrors = validateForm();
            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                setIsLoading(false);
                return;
            }

            const sessionData = {
                name: formData.name.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                duration: parseInt(formData.duration),
                machineNumber: machine.machineNumber
            };

            await onBookMachine(sessionData);
            console.log('Machine booked successfully');
            onClose();
        } catch (error) {
            console.error('Error booking machine:', error);
            setError(error.message || 'Failed to book machine. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async () => {
        try {
            console.log('Attempting to delete session:', machine.session?.id);
            setIsLoading(true);
            setError('');

            if (!machine.session?.id) {
                throw new Error('No session ID found');
            }

            await onDeleteSession(machine.session.id);
            console.log('Session deleted successfully');
            onClose();
        } catch (error) {
            console.error('Error deleting session:', error);
            setError(error.message || 'Failed to delete session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePickupClothes = async () => {
        try {
            console.log('Clothes picked up for session:', machine.session?.id);
            setIsLoading(true);
            setError('');

            if (!machine.session?.id) {
                throw new Error('No session ID found');
            }

            await onDeleteSession(machine.session.id);
            console.log('Clothes picked up successfully, session deleted');
            onClose();
        } catch (error) {
            console.error('Error during pickup:', error);
            setError(error.message || 'Failed to process pickup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCallUser = () => {
        if (machine.session?.phoneNumber) {
            // Open phone dialer or copy phone number
            if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
                // Mobile device - open phone dialer
                window.open(`tel:${machine.session.phoneNumber}`, '_self');
            } else {
                // Desktop - copy to clipboard
                navigator.clipboard.writeText(machine.session.phoneNumber).then(() => {
                    alert(`Phone number ${machine.session.phoneNumber} copied to clipboard!`);
                }).catch(() => {
                    alert(`Phone number: ${machine.session.phoneNumber}`);
                });
            }
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!machine) {
        return null;
    }

    const isAvailable = machine.status === 'available';
    const isWaitingPickup = machine.status === 'waiting_pickup';
    const isOccupied = machine.status === 'occupied';

    const getStatusConfig = () => {
        if (isAvailable) return {
            bg: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            text: 'Available for booking',
            icon: '✨'
        };
        if (isOccupied) return {
            bg: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            text: 'Currently in use',
            icon: '🔒'
        };
        if (isWaitingPickup) return {
            bg: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            text: 'Clothes ready for pickup',
            icon: '🧺'
        };
        return {
            bg: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
            text: 'Unknown status',
            icon: '❓'
        };
    };

    const statusConfig = getStatusConfig();

    const getWaitingTime = () => {
        if (isWaitingPickup && machine.session) {
            const endTime = new Date(machine.session.endTime);
            const now = new Date();
            const waitingMs = now - endTime;
            
            if (waitingMs > 0) {
                const waitingMinutes = Math.floor(waitingMs / (1000 * 60));
                const hours = Math.floor(waitingMinutes / 60);
                const mins = waitingMinutes % 60;
                
                if (hours > 0) {
                    return `${hours}h ${mins}m`;
                }
                return `${waitingMinutes}m`;
            } else {
                return 'Just finished';
            }
        }
        return 'Unknown';
    };

    const getRemainingTime = () => {
        if (isOccupied && machine.session) {
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

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header" style={{background: statusConfig.bg}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <div style={{fontSize: '32px'}}>{statusConfig.icon}</div>
                        <div>
                            <h2 style={{fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0'}}>Machine {machine.machineNumber}</h2>
                            <div style={{fontSize: '14px', opacity: 0.9}}>{statusConfig.text}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Machine Details */}
                    <div style={{background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0'}}>
                        <h4 style={{fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <div style={{width: '8px', height: '8px', background: '#667eea', borderRadius: '50%'}}></div>
                            Machine Details
                        </h4>
                        
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
                            <div style={{background: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                                <div style={{fontSize: '12px', fontWeight: '600', color: '#718096', marginBottom: '4px'}}>NUMBER</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: '#2d3748'}}>{machine.machineNumber}</div>
                            </div>
                            
                            {machine.location && (
                                <div style={{background: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                                    <div style={{fontSize: '12px', fontWeight: '600', color: '#718096', marginBottom: '4px'}}>LOCATION</div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold', color: '#2d3748'}}>{machine.location}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div style={{background: 'rgba(245, 101, 101, 0.1)', border: '2px solid rgba(245, 101, 101, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '24px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <svg style={{width: '20px', height: '20px', color: '#f56565', flexShrink: 0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 style={{fontWeight: '600', color: '#991b1b', margin: '0 0 4px 0'}}>Error</h4>
                                    <p style={{color: '#b91c1c', margin: 0}}>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Current Session Information */}
                    {machine.session && (
                        <div className="session-info" style={{marginBottom: '24px'}}>
                            <h4 className="session-title">Active Session</h4>
                            
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px'}}>
                                <div style={{background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '12px'}}>
                                    <div style={{fontSize: '12px', fontWeight: '600', color: '#2b6cb0', marginBottom: '4px'}}>User</div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold', color: '#1e40af'}}>{machine.session.name || machine.session.userName}</div>
                                </div>
                                
                                <div style={{background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '12px'}}>
                                    <div style={{fontSize: '12px', fontWeight: '600', color: '#2b6cb0', marginBottom: '4px'}}>Phone</div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold', color: '#1e40af'}}>{machine.session.phoneNumber}</div>
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px'}}>
                                <div style={{background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '12px'}}>
                                    <div style={{fontSize: '12px', fontWeight: '600', color: '#2b6cb0', marginBottom: '4px'}}>Duration</div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold', color: '#1e40af'}}>{machine.session.duration} minutes</div>
                                </div>
                                
                                <div style={{background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '12px'}}>
                                    <div style={{fontSize: '12px', fontWeight: '600', color: '#2b6cb0', marginBottom: '4px'}}>
                                        {isWaitingPickup ? 'Waiting Time' : 'Time Left'}
                                    </div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold', color: isWaitingPickup ? '#d97706' : getRemainingTime()?.includes('expired') ? '#dc2626' : '#059669'}}>
                                        {isWaitingPickup ? getWaitingTime() : getRemainingTime()}
                                    </div>
                                </div>
                            </div>

                            <div style={{background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '12px'}}>
                                <div style={{fontSize: '12px', fontWeight: '600', color: '#2b6cb0', marginBottom: '4px'}}>Started At</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: '#1e40af'}}>
                                    {new Date(machine.session.startTime).toLocaleString()}
                                </div>
                            </div>

                            {isWaitingPickup && (
                                <div style={{background: '#fed7aa', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px', textAlign: 'center', marginTop: '12px'}}>
                                    <div style={{color: '#92400e', fontWeight: 'bold', fontSize: '14px'}}>
                                        🧺 Clothes ready for pickup!
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Available - Booking Form */}
                    {isAvailable && (
                        <div style={{background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '16px', padding: '24px', border: '1px solid #a7f3d0', marginBottom: '24px'}}>
                            <h4 style={{fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <span style={{fontSize: '22px'}}>✨</span>
                                Book This Machine
                            </h4>

                            <div style={{marginBottom: '20px'}}>
                                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#047857', marginBottom: '8px'}}>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                    autoComplete="off"
                                    className="modal-transparent-input"
                                />
                            </div>

                            <div style={{marginBottom: '20px'}}>
                                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#047857', marginBottom: '8px'}}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter 10-digit phone number"
                                    disabled={isLoading}
                                    autoComplete="off"
                                    className="modal-transparent-input"
                                />
                            </div>

                            <div style={{marginBottom: '24px'}}>
                                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#047857', marginBottom: '8px'}}>Duration (minutes)</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="modal-transparent-select"
                                    required
                                >
                                    <option value="" disabled>Select duration</option>
                                    <option value="1">1 minute (Testing)</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>

                            {/* Enhanced Book Button */}
                            <button
                                onClick={handleBookMachine}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '16px 24px',
                                    background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontFamily: 'Inter, sans-serif',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: '20px', 
                                            height: '20px', 
                                            border: '2px solid rgba(255, 255, 255, 0.3)', 
                                            borderLeftColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        <span>Booking...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg style={{width: '22px', height: '22px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Book</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        {isOccupied && (
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                                <button onClick={handleCallUser} className="btn btn-primary">
                                    <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>Call User</span>
                                </button>
                                
                                <button
                                    onClick={handleDeleteSession}
                                    disabled={isLoading}
                                    className={`btn ${isLoading ? '' : 'btn-danger'}`}
                                    style={isLoading ? {opacity: 0.6, cursor: 'not-allowed'} : {}}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner" style={{width: '20px', height: '20px', border: '2px solid rgba(255, 255, 255, 0.3)', borderLeftColor: 'white'}}></div>
                                            <span>Ending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>End Session</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {isWaitingPickup && (
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                                <button onClick={handleCallUser} className="btn btn-warning">
                                    <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>Call User</span>
                                </button>

                                <button
                                    onClick={handlePickupClothes}
                                    disabled={isLoading}
                                    className={`btn ${isLoading ? '' : 'btn-success'}`}
                                    style={isLoading ? {opacity: 0.6, cursor: 'not-allowed'} : {}}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner" style={{width: '20px', height: '20px', border: '2px solid rgba(255, 255, 255, 0.3)', borderLeftColor: 'white'}}></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{fontSize: '18px'}}>🧺</span>
                                            <span>Picked Up</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineModal; 