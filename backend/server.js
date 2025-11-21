const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// TODO: Connect to Database
// WHY: Initialize DB connection before starting server
connectDB();

// TODO: Init Middleware
// WHY: Parse JSON bodies and handle CORS
app.use(express.json({ extended: false }));
app.use(cors());

// TODO: Define Routes
// WHY: Map URL paths to route handlers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/calendar', require('./routes/calendar'));

const PORT = process.env.PORT || 5000;

// TODO: Start Server
// WHY: Listen for incoming requests
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
