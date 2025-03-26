const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicleModel');
const vehicleController = require('../controllers/vehicleController');
const vehicleRecordController = require('../controllers/vehicleRecordController');
// ✅ Get all vehicles
router.get('/all-vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find(); // Fetch all vehicle records
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error });
    }
});

// ✅ Add a new vehicle
router.post('/', async (req, res) => {
    try {
        const { registrationNumber, vehicleType, customerName, customerMobile, slotNumber } = req.body;

        // ✅ Check if the slot number is already occupied
        const existingVehicle = await Vehicle.findOne({ slotNumber });
        if (existingVehicle) {
            return res.status(400).json({ message: `Slot ${slotNumber} is already occupied.` });
        }

        // ✅ Save new vehicle if slot is free
        const newVehicle = new Vehicle({ registrationNumber, vehicleType, customerName, customerMobile, slotNumber });
        await newVehicle.save();
        
        res.status(201).json({ message: 'Vehicle added successfully!', vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/dashboard-stats', vehicleController.getDashboardStats);
// ✅ Search vehicle by registration number
router.get('/search/:registrationNumber', vehicleController.searchVehicle);

router.delete('/remove-by-number/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;
        
        // Remove vehicle from active vehicles
        const vehicle = await Vehicle.findOneAndDelete({ registrationNumber });

        if (!vehicle) {
            return res.status(404).json({ message: '❌ Vehicle not found' });
        }

        // Update the corresponding parking slot
        await ParkingSlot.findOneAndUpdate(
            { slotNumber: vehicle.slotNumber }, 
            { isOccupied: false }
        );

        // Update the vehicle record
        const updatedRecord = await VehicleRecord.findOneAndUpdate(
            { 
                registrationNumber, 
                status: 'Parked' 
            },
            { 
                exitTime: new Date(),
                status: 'Exited',
                duration: Math.round((new Date() - vehicle.entryTime) / (1000 * 60))
            },
            { new: true }
        );

        res.status(200).json({ 
            message: '✅ Vehicle removed successfully!', 
            vehicle,
            record: updatedRecord 
        });
    } catch (error) {
        res.status(500).json({ message: '⚠️ Server error', error });
    }
});
// Specifically for creating vehicle records
router.get('/record', vehicleRecordController.getAllVehicleRecords);

module.exports = router;
