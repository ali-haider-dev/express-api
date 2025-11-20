const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if we have an active connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless, we shouldn't exit the process, just throw the error
    // process.exit(1); 
  }
};

module.exports = connectDB;
