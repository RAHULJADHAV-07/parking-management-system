const Vehicle = require("../models/vehicleModel");
const ParkingSlot = require("../models/ParkingSlot");
const mongoose = require('mongoose');
const VehicleRecord = require("../models/VehicleRecord");
// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total slots (hardcoded or from ParkingSlot model)
    const totalSlots = await ParkingSlot.countDocuments();

    // Occupied slots
    const occupiedSlots = await Vehicle.countDocuments();

    // Available slots (total - occupied)
    const availableSlots = totalSlots - occupiedSlots;

    // Today's entries (within last 24 hours)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayEntries = await Vehicle.countDocuments({
      entryTime: { 
        $gte: yesterday, 
        $lte: today 
      }
    });

    res.json({
      totalSlots,
      occupiedSlots,
      availableSlots,
      todayEntries
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
};
// Add a vehicle (Park)
exports.addVehicle = async (req, res) => {
  try {
    console.log("🔹 Vehicle data received:", req.body);

    const { registrationNumber, vehicleType, customerName, customerMobile } = req.body;

    if (!registrationNumber || !vehicleType || !customerName || !customerMobile) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find an available slot
    const availableSlot = await ParkingSlot.findOne({ isOccupied: false });

    if (!availableSlot) {
      return res.status(400).json({ error: "No parking slots available!" });
    }

    const newVehicle = new Vehicle({
      registrationNumber,
      vehicleType,
      customerName,
      customerMobile,
      slotNumber: availableSlot.slotNumber,
      entryTime: new Date()
    });

    await newVehicle.save();
    availableSlot.isOccupied = true;
    await availableSlot.save();

    res.status(201).json({ message: "Vehicle parked successfully", vehicle: newVehicle });
  } catch (err) {
    console.error("❌ Error adding vehicle:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.removeVehicleByNumber = async (req, res) => {
  try {
      const { registrationNumber } = req.params;

      // ✅ Check if the vehicle exists and delete it
      const deletedVehicle = await Vehicle.findOneAndDelete({ registrationNumber });

      if (!deletedVehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
      }

      // Update the corresponding parking slot to mark it as unoccupied
      await ParkingSlot.findOneAndUpdate(
        { slotNumber: deletedVehicle.slotNumber }, 
        { isOccupied: false }
      );

      // Set exit time
      deletedVehicle.exitTime = new Date();
      await deletedVehicle.save();

      res.json({ message: 'Vehicle removed successfully', vehicle: deletedVehicle });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Get all parked vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    console.error("❌ Error fetching vehicles:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.searchVehicle = async (req, res) => {
  try {
      const { registrationNumber } = req.params;
      const vehicle = await Vehicle.findOne({ registrationNumber });

      if (!vehicle) {
          return res.status(404).json({ found: false, message: 'Vehicle not found' });
      }

      res.json({
          found: true,
          registrationNumber: vehicle.registrationNumber,
          slotNumber: vehicle.slotNumber,
          location: vehicle.location || 'Unknown',
          entryTime: vehicle.entryTime || new Date()
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }


  
};