const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // TODO: Connect to MongoDB using mongoose.connect()
    // WHY: Establish connection to the database to store and retrieve data
    // HINT: Use process.env.MONGO_URI for the connection string
    
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // TODO: Exit process with failure
    // WHY: If DB connection fails, the server cannot function properly
    process.exit(1);
  }
};

module.exports = connectDB;
