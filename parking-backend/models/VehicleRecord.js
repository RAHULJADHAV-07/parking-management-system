const mongoose = require("mongoose");

const vehicleRecordSchema = new mongoose.Schema({
    registrationNumber: { 
        type: String, 
        required: [true, 'Registration number is required'],
        trim: true 
    },
    vehicleType: { 
        type: String, 
        required: [true, 'Vehicle type is required'],
        trim: true 
    },
    customerName: { 
        type: String, 
        required: [true, 'Customer name is required'],
        trim: true 
    },
    customerMobile: { 
        type: String, 
        required: [true, 'Customer mobile is required'],
        trim: true 
    },
    slotNumber: { 
        type: Number, 
        required: [true, 'Slot number is required'] 
    },
    entryTime: { 
        type: Date, 
        required: [true, 'Entry time is required'],
        default: Date.now 
    },
    exitTime: { 
        type: Date, 
        default: null 
    },
    duration: { 
        type: Number, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ['Parked', 'Exited'], 
        default: 'Parked' 
    }
}, { timestamps: true });

module.exports = mongoose.model("VehicleRecord", vehicleRecordSchema);