const Vehicle = require("../models/vehicleModel");
const VehicleRecord = require("../models/VehicleRecord");
const ParkingSlot = require("../models/ParkingSlot");

exports.createVehicleRecord = async (req, res) => {
    try {
        console.log('Received vehicle record creation request:', req.body);

        const { registrationNumber, vehicleType, customerName, customerMobile, slotNumber } = req.body;
        
        // Enhanced input validation with more specific checks
        if (!registrationNumber || !vehicleType || !customerName || !customerMobile || slotNumber === undefined) {
            console.error('Missing required fields:', req.body);
            return res.status(400).json({ 
                message: "Missing required fields", 
                receivedData: req.body
            });
        }

        // Additional validation for registration number format and mobile number
        const registrationRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        if (!registrationRegex.test(registrationNumber)) {
            return res.status(400).json({ 
                message: "Invalid registration number format" 
            });
        }

        if (!mobileRegex.test(customerMobile)) {
            return res.status(400).json({ 
                message: "Invalid mobile number" 
            });
        }

        const newRecord = new VehicleRecord({
            registrationNumber,
            vehicleType,
            customerName,
            customerMobile,
            slotNumber,
            entryTime: new Date(),
            status: 'Parked'
        });

        const savedRecord = await newRecord.save();
        
        console.log('Vehicle record created successfully:', savedRecord);

        res.status(201).json({ 
            message: "Vehicle record created successfully", 
            record: savedRecord 
        });
    } catch (error) {
        console.error('Error creating vehicle record:', error);

        // Detailed error logging
        if (error.name === 'ValidationError') {
            console.error('Validation Error Details:', error.errors);
            return res.status(400).json({ 
                message: "Validation Error", 
                details: error.errors 
            });
        }

        res.status(500).json({ 
            message: "Internal server error creating vehicle record", 
            error: error.message,
            fullError: error
        });
    }
};

exports.updateVehicleRecord = async (req, res) => {
    try {
        const { registrationNumber } = req.params;

        // Validate registration number
        if (!registrationNumber) {
            return res.status(400).json({ 
                message: "Registration number is required" 
            });
        }

        // Find the most recent parking record for this vehicle
        const vehicleRecord = await VehicleRecord.findOne({
            registrationNumber,
            status: 'Parked'
        }).sort({ entryTime: -1 });

        if (!vehicleRecord) {
            return res.status(404).json({ 
                message: "No active parking record found for this vehicle" 
            });
        }

        // Calculate duration
        const exitTime = new Date();
        const duration = Math.round((exitTime - vehicleRecord.entryTime) / (1000 * 60)); // duration in minutes

        // Update the record
        vehicleRecord.exitTime = exitTime;
        vehicleRecord.duration = duration;
        vehicleRecord.status = 'Exited';

        await vehicleRecord.save();

        // Log successful record update
        console.log(`Vehicle record updated: ${registrationNumber}, Duration: ${duration} mins`);

        res.json({
            message: "Vehicle record updated successfully",
            record: vehicleRecord
        });
    } catch (error) {
        // Log detailed error
        console.error('Error updating vehicle record:', error);

        res.status(500).json({ 
            message: "Internal server error updating vehicle record", 
            error: error.message 
        });
    }
};

exports.getAllVehicleRecords = async (req, res) => {
    try {
        // Add pagination to prevent overwhelming response
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skipIndex = (page - 1) * limit;

        console.log(`Fetching vehicle records - Page: ${page}, Limit: ${limit}`);

        // Fetch paginated records with filtered and reduced fields
        const records = await VehicleRecord.find()
            .sort({ entryTime: -1 })
            .select('registrationNumber vehicleType customerName slotNumber status entryTime exitTime')
            .limit(limit)
            .skip(skipIndex);

        // Count total records for metadata
        const totalRecords = await VehicleRecord.countDocuments();

        // Log records
        console.log(`Fetched ${records.length} records out of ${totalRecords} total`);

        // Provide metadata with response
        res.json({
            records,
            totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit)
        });
    } catch (error) {
        // Comprehensive error logging
        console.error('Error fetching vehicle records:', error);

        res.status(500).json({ 
            message: "Internal server error fetching vehicle records", 
            error: error.message 
        });
    }
};