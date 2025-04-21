const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5; // Max retry attempts
  const delay = 5000; // Delay between retries (in milliseconds)

  while (retries) {
    try {
      // Direct connection without deprecated options
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully ✅');
      return; // Exit the function if successful
    } catch (error) {
      console.error(`MongoDB connection failed ❌. Retries left: ${retries}...`);
      console.error(`Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error('All connection retries failed.');
        process.exit(1); // Exit if no retries left
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    }
  }
};

module.exports = connectDB;
