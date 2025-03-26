const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    slotNumber: { type: Number, required: true },
    entryTime: { type: Date, default: Date.now }, // ✅ Auto-sets when vehicle is added
    exitTime: { type: Date, default: null }  // ✅ Add this field
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
