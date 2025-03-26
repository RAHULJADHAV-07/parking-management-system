const mongoose = require("mongoose");
const ParkingSlot = require("./models/ParkingSlot");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const initializeSlots = async () => {
  try {
    await ParkingSlot.deleteMany(); // Clear existing slots
    let slots = [];
    for (let i = 1; i <= 100; i++) {
      slots.push({ slotNumber: i, isOccupied: false });
    }
    await ParkingSlot.insertMany(slots);
    console.log("✅ Parking slots initialized!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error initializing slots:", err);
    mongoose.connection.close();
  }
};

initializeSlots();
