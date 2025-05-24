import Session from '../models/session.model.js';

// Create a new washing machine session
export const createSession = async (req, res) => {
    try {
        console.log('Creating new session with data:', req.body);
        const { name, phoneNumber, duration, machineNumber } = req.body; 

        if (!name || !phoneNumber || !duration || !machineNumber) {
            console.log('Validation failed: Missing required fields');
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
            console.log(`Machine ${machineNumber} is already in use`);
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
        console.log('Session created successfully:', savedSession._id);

        res.status(201).json({
            message: "Session created successfully",
            session: savedSession
        });

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ 
            message: "Error creating session",
            error: error.message 
        });
    }
};

// Get machine status for all machines
export const getMachineStatus = async (req, res) => {
    try {
        console.log('Fetching machine status...');
        
        // For now, we'll check for 1 machine (as mentioned in requirements)
        // This can be easily expanded for multiple machines
        const totalMachines = 1;
        const machines = [];

        for (let i = 1; i <= totalMachines; i++) {
            try {
                // Find active session for this machine
                const activeSession = await Session.findOne({
                    machineNumber: i,
                    isActive: true
                });

                if (activeSession && !activeSession.isExpired()) {
                    // Machine is occupied
                    machines.push({
                        machineNumber: i,
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
                    // Machine is available
                    machines.push({
                        machineNumber: i,
                        status: 'available',
                        session: null
                    });
                    
                    // If session expired, mark it as inactive
                    if (activeSession && activeSession.isExpired()) {
                        await Session.findByIdAndUpdate(activeSession._id, { isActive: false });
                        console.log(`Expired session ${activeSession._id} marked as inactive`);
                    }
                }
            } catch (machineError) {
                console.error(`Error checking machine ${i}:`, machineError);
                // In case of error, assume machine is available
                machines.push({
                    machineNumber: i,
                    status: 'available',
                    session: null
                });
            }
        }

        console.log('Machine status fetched successfully:', machines);
        res.status(200).json({ machines });

    } catch (error) {
        console.error('Error fetching machine status:', error);
        res.status(500).json({ 
            message: "Error fetching machine status",
            error: error.message 
        });
    }
};

// Get all sessions
export const getSessions = async (req, res) => {
    try {
        console.log('Fetching all sessions...');
        const sessions = await Session.find().sort({ createdAt: -1 });
        console.log(`Found ${sessions.length} sessions`);
        res.status(200).json({ sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: "Error fetching sessions", error: error.message });
    }
};

// Get active sessions
export const getActiveSessions = async (req, res) => {
    try {
        console.log('Fetching active sessions...');
        const activeSessions = await Session.find({ isActive: true }).sort({ createdAt: -1 });
        console.log(`Found ${activeSessions.length} active sessions`);
        res.status(200).json({ sessions: activeSessions });
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        res.status(500).json({
             message: "Error fetching active sessions", error: error.message 
        });
    }
};

// Delete a session 
export const deleteSession = async (req, res) => {
    try {
        console.log('Deleting session with ID:', req.params.id);
        const session = await Session.findById(req.params.id);
        
        if(!session){
            console.log('Session not found for deletion');
            return res.status(404).json({ message: "Session not found" });
        }

        await Session.findByIdAndDelete(req.params.id);
        console.log('Session deleted successfully');

        res.status(200).json({
            message: "Session deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ 
            message: error.message
        });
    }
};
