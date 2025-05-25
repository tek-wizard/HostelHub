import Session from '../models/session.model.js';

// Create a new washing machine session
export const createSession = async (req, res) => {
    try {
        const { name, phoneNumber, duration, machineNumber } = req.body; 

        if (!name || !phoneNumber || !duration || !machineNumber) {
            return res.status(400).json({ 
                message: "Please provide all required fields: name, phoneNumber, duration, and machineNumber" 
            });
        }

        // Check if machine is already in use
        const existingSession = await Session.findOne({
            machineNumber,
            isActive: true,
            startTime: { 
                $lt: new Date(Date.now() + duration * 60000) 
            }
        });

        if (existingSession) {
            return res.status(400).json({ 
                message: "This machine is already in use for the requested duration" 
            });
        }

        const newSession = new Session({
            name,
            phoneNumber,
            duration,
            machineNumber,
            startTime: new Date()
        });

        const savedSession = await newSession.save();

        res.status(201).json({
            message: "Session created successfully",
            session: savedSession
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error creating session",
            error: error.message 
        });
    }
};

// Get machine status for all machines
export const getMachineStatus = async (req, res) => {
    try {
        // Mock machine data - you can replace this with actual database call later
        const machinesData = [
            {
                machineNumber: 1,
                name: "WashMax Pro 3000",
                location: "Ground Floor - Hostel A",
                capacity: "8 kg",
                lastMaintenance: new Date("2024-01-15"),
                isActive: true
            },
            {
                machineNumber: 2,
                name: "AquaClean Deluxe",
                location: "First Floor - Hostel A",
                capacity: "10 kg",
                lastMaintenance: new Date("2024-01-10"),
                isActive: true
            },
            {
                machineNumber: 3,
                name: "SpinMaster Elite",
                location: "Ground Floor - Hostel B",
                capacity: "7 kg",
                lastMaintenance: new Date("2024-01-20"),
                isActive: false
            },
            {
                machineNumber: 4,
                name: "UltraWash 2024",
                location: "First Floor - Hostel B",
                capacity: "9 kg",
                lastMaintenance: new Date("2024-01-05"),
                isActive: true
            },
            {
                machineNumber: 5,
                name: "PowerClean Max",
                location: "Second Floor - Hostel A",
                capacity: "8 kg",
                lastMaintenance: new Date("2024-01-12"),
                isActive: true
            }
        ];

        const machines = [];

        for (const machineData of machinesData) {
            const activeSession = await Session.findOne({
                machineNumber: machineData.machineNumber,
                isActive: true
            });

            const baseMachineInfo = {
                machineNumber: machineData.machineNumber,
                name: machineData.name,
                location: machineData.location,
                capacity: machineData.capacity,
                lastMaintenance: machineData.lastMaintenance,
                isActive: machineData.isActive
            };

            if (activeSession) {
                const isExpired = activeSession.isExpired();
                
                if (!isExpired) {
                    // Machine is still occupied (session not expired)
                    machines.push({
                        ...baseMachineInfo,
                        status: 'occupied',
                        session: {
                            id: activeSession._id,
                            name: activeSession.name,
                            phoneNumber: activeSession.phoneNumber,
                            startTime: activeSession.startTime,
                            duration: activeSession.duration,
                            endTime: new Date(activeSession.startTime.getTime() + activeSession.duration * 60000)
                        }
                    });
                } else {
                    // Session expired - machine is waiting for pickup
                    machines.push({
                        ...baseMachineInfo,
                        status: 'waiting_pickup',
                        session: {
                            id: activeSession._id,
                            name: activeSession.name,
                            phoneNumber: activeSession.phoneNumber,
                            startTime: activeSession.startTime,
                            duration: activeSession.duration,
                            endTime: new Date(activeSession.startTime.getTime() + activeSession.duration * 60000)
                        }
                    });
                }
            } else {
                // No active session - machine is available
                machines.push({
                    ...baseMachineInfo,
                    status: 'available',
                    session: null
                });
            }
        }

        res.status(200).json({ machines });

    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching machine status",
            error: error.message 
        });
    }
};

// Get all sessions
export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.status(200).json({ sessions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions", error: error.message });
    }
};

// Get active sessions
export const getActiveSessions = async (req, res) => {
    try {
        const activeSessions = await Session.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ sessions: activeSessions });
    } catch (error) {
        res.status(500).json({
             message: "Error fetching active sessions", error: error.message 
        });
    }
};

// Delete a session 
export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        
        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }

        await Session.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Session deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message
        });
    }
};
