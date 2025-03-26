const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: { type: Number, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
