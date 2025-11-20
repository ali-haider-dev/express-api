const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);

// Error handler middleware (simple version)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(res.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

module.exports = app;
