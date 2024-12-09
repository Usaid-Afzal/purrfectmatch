require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes'); // Import your auth routes
const listingRoutes = require('./src/routes/listingRoutes');
const interactionRoutes = require('./src/routes/interactionRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const reputationRoutes = require('./src/routes/reputationRoutes');

const app = express();

const http = require('http');

const { initSocket } = require('./src/config/socket');

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);
 // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes); // new line
app.use('/api/interactions', interactionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reputationRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Initialize Socket.IO with the HTTP server
const server = http.createServer(app);
const io = initSocket(server);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app; // Export for testing
