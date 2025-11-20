const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if we have an active connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail after 5s if cannot connect
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Throw error so the calling function knows we failed
    throw error;
  }
};

module.exports = connectDB;
