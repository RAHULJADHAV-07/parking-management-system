require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const vehicleRoutes = require("./routes/vehicleRoutes");
const VehicleRecord = require('./models/VehicleRecord');

const app = express();

// Middleware
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors());

// Database Connection with Enhanced Logging
async function connectToDatabase() {
    try {
        // Log connection details (without exposing full URI)
        console.log(`Attempting to connect to MongoDB...`);
        console.log(`Connection URI: ${process.env.MONGO_URI ? 'Valid' : 'MISSING'}`);

        // Remove deprecated options
        await mongoose.connect(process.env.MONGO_URI, {});

        // Verify database connection
        const connection = mongoose.connection;
        console.log("✅ MongoDB Connected Successfully");
        console.log(`Database Name: ${connection.db.databaseName}`);

        // Test model creation
        try {
            const testRecord = new VehicleRecord({
                registrationNumber: 'SYSTEM_TEST',
                vehicleType: 'SystemTest',
                customerName: 'System Test',
                customerMobile: '0000000000',
                slotNumber: 0,
                entryTime: new Date(),
                status: 'Parked'
            });

            await testRecord.save();
            console.log("✅ Test record created successfully");
        } catch (modelTestError) {
            console.error("❌ Failed to create test record:", modelTestError.message);
        }

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        
        // Provide more detailed error information
        if (error.name === 'MongoError') {
            console.error(`Mongo Error Code: ${error.code}`);
        }

        // Exit process with failure
        process.exit(1);
    }
}

// Routes
app.use("/api/vehicles", vehicleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Connect to database and start server
connectToDatabase().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`Server Environment: ${process.env.NODE_ENV || 'development'}`);
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
});