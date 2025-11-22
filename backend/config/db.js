const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using mongoose.connect()
    // WHY: Establish connection to the database to store and retrieve data
    // HINT: Use process.env.MONGO_URI for the connection string
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    // WHY: If DB connection fails, the server cannot function properly
    process.exit(1);
  }
};

module.exports = connectDB;
