import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'],
        default: Date.now
    },
    duration: {
        type: Number, 
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute'],
        max: [180, 'Duration cannot exceed 3 hours']
    },
    machineNumber: {
        type: Number,
        required: [true, 'Machine number is required'],
        min: [1, 'Machine number must be at least 1']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

sessionSchema.index({ startTime: 1 }, { expireAfterSeconds: 0 });

sessionSchema.methods.isExpired = function() {
    const now = new Date();
    const endTime = new Date(this.startTime.getTime() + this.duration * 60000); 
    return now > endTime;
};

const Session = mongoose.model('Session', sessionSchema); 

export default Session;