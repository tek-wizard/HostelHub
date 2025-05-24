import React, { useState } from 'react';

const MachineModal = ({ machine, isOpen, onClose, onBook, onDelete }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        duration: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            console.log('Modal opened for machine:', machine);
            setFormData({ name: '', phoneNumber: '', duration: '' });
            setError('');
        }
    }, [isOpen, machine]);

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

            await onBook(sessionData);
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

            await onDelete(machine.session.id);
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

            await onDelete(machine.session.id);
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

    if (!isOpen || !machine) {
        return null;
    }

    const isAvailable = machine.status === 'available';
    const isWaitingPickup = machine.status === 'waiting_pickup';
    const isOccupied = machine.status === 'occupied';

    let statusColor = '#6c757d';
    if (isAvailable) statusColor = '#28a745';
    else if (isOccupied) statusColor = '#dc3545';
    else if (isWaitingPickup) statusColor = '#ffc107';

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

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
            onClick={handleBackdropClick}
        >
            <div style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
                {/* Header */}
                <div style={{
                    background: statusColor,
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '0 0 5px 0'
                        }}>
                            Machine {machine.machineNumber}
                        </h2>
                        <div style={{
                            fontSize: '14px',
                            opacity: 0.9
                        }}>
                            {isAvailable && 'Available for booking'}
                            {isOccupied && 'Currently in use'}
                            {isWaitingPickup && '🧺 Clothes ready for pickup'}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '4px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                    {/* Machine Details */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        border: '1px solid #e9ecef'
                    }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            fontSize: '14px',
                            color: '#666',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            Machine Details
                        </h4>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                    Machine Number
                                </div>
                                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                    {machine.machineNumber}
                                </div>
                            </div>
                            
                            {machine.name && (
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                        Name
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                        {machine.name}
                                    </div>
                                </div>
                            )}
                            
                            {machine.location && (
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                        Location
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                        {machine.location}
                                    </div>
                                </div>
                            )}
                            
                            {machine.capacity && (
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                        Capacity
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                        {machine.capacity}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            background: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            color: '#721c24',
                            padding: '15px',
                            borderRadius: '6px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {error}
                            </div>
                        </div>
                    )}

                    {isAvailable ? (
                        /* Booking Form */
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '20px'
                            }}>
                                Book This Machine
                            </h3>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '5px'
                                }}>
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    placeholder="Enter your full name"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '5px'
                                }}>
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    placeholder="Enter your phone number"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '5px'
                                }}>
                                    Duration *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">Select duration</option>
                                    <option value="1">1 minute (TEST)</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                    <option value="180">3 hours</option>
                                </select>
                            </div>

                            <button
                                onClick={handleBookMachine}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: isLoading ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Booking...' : 'Book Machine'}
                            </button>
                        </div>
                    ) : isWaitingPickup ? (
                        /* Pickup Actions */
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                🧺 Clothes Ready for Pickup
                            </h3>

                            <div style={{
                                background: '#fff3cd',
                                padding: '15px',
                                borderRadius: '6px',
                                marginBottom: '20px',
                                border: '2px solid #ffc107'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>
                                            Owner
                                        </div>
                                        <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>
                                            {machine.session?.name}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>
                                            Phone Number
                                        </div>
                                        <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>
                                            {machine.session?.phoneNumber}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>
                                            Finished At
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                            {new Date(machine.session?.endTime).toLocaleString()}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#856404', marginBottom: '5px' }}>
                                            Waiting Time
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#856404', fontWeight: '600' }}>
                                            {getWaitingTime()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    onClick={handleCallUser}
                                    disabled={isLoading}
                                    style={{
                                        background: isLoading ? '#6c757d' : '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: isLoading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    📞 Call User
                                </button>

                                <button
                                    onClick={handlePickupClothes}
                                    disabled={isLoading}
                                    style={{
                                        background: isLoading ? '#6c757d' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: isLoading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isLoading ? 'Processing...' : '✅ Pickup Done'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Session Info and Delete for Occupied */
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '20px'
                            }}>
                                Current Session
                            </h3>

                            <div style={{
                                background: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '6px',
                                marginBottom: '20px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                            User Name
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                            {machine.session?.name}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                            Phone Number
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                            {machine.session?.phoneNumber}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                            Duration
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                            {machine.session?.duration} minutes
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                            Started At
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                            {new Date(machine.session?.startTime).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                        Time Remaining
                                    </div>
                                    <div style={{ fontSize: '14px', color: statusColor, fontWeight: '600' }}>
                                        {(() => {
                                            if (machine.session) {
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
                                            return 'Unknown';
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDeleteSession}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: isLoading ? '#6c757d' : '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Ending Session...' : 'End Session'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MachineModal; 