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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  let errorResponse = {
    success: false,
    statusCode: err.statusCode || 500,
    error: err.message || 'Server Error',
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    errorResponse = {
      success: false,
      statusCode: 404,
      error: 'Resource not found',
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    errorResponse = {
      success: false,
      statusCode: 400,
      error: 'Duplicate field value entered',
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    errorResponse = {
      success: false,
      statusCode: 400,
      error: errors,
    };
  }

  res.status(errorResponse.statusCode).json(errorResponse);
});


module.exports = app;
