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

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !machine) {
        return null;
    }

    const isAvailable = machine.status === 'available';

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px'
            }}
            onClick={handleBackdropClick}
        >
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                {/* Modal Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px',
                    borderBottom: '1px solid #e5e5e5'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#333',
                        margin: 0
                    }}>
                        Machine {machine.machineNumber}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            color: '#999',
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div style={{ padding: '24px' }}>
                    {/* Status Display */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            backgroundColor: isAvailable ? '#e8f5e8' : '#ffe6e6',
                            color: isAvailable ? '#2d7d2d' : '#cc0000'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                marginRight: '8px',
                                backgroundColor: isAvailable ? '#4CAF50' : '#F44336'
                            }}></div>
                            {isAvailable ? 'Available' : 'In Use'}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: '#ffe6e6',
                            border: '1px solid #ff9999',
                            borderRadius: '6px'
                        }}>
                            <p style={{
                                fontSize: '14px',
                                color: '#cc0000',
                                margin: 0
                            }}>
                                {error}
                            </p>
                        </div>
                    )}

                    {isAvailable ? (
                        /* Booking Form */
                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '4px'
                                }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    placeholder="Enter your name"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '4px'
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
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    marginBottom: '4px'
                                }}>
                                    Duration (minutes) *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">Select duration</option>
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
                                    backgroundColor: isLoading ? '#ccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Booking...' : 'Book Machine'}
                            </button>
                        </div>
                    ) : (
                        /* Session Info and Delete */
                        <div>
                            <div style={{
                                backgroundColor: '#f8f8f8',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#333',
                                    margin: '0 0 12px 0'
                                }}>
                                    Current Session
                                </h3>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>User:</strong> {machine.session?.name}
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Phone:</strong> {machine.session?.phoneNumber}
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Duration:</strong> {machine.session?.duration} minutes
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Started:</strong> {new Date(machine.session?.startTime).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDeleteSession}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    backgroundColor: isLoading ? '#ccc' : '#F44336',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Deleting...' : 'End Session'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MachineModal; 