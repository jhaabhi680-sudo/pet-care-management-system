/**
 * Error Middleware: Handles 404 Not Found and Global Express Errors
 * Demonstrates: Web Lab Experiment 8 & 20 (Clean error handling in REST APIs)
 */

// 404 Route Not Found Middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Centralized Error Handler
export const errorHandler = (err, req, res, next) => {
  // If status is 200, change to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose CastError (invalid ObjectId)
  let message = err.message;
  if (err.name === 'CastError') {
    message = 'Resource not found: Invalid database ID format';
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate entry: That ${field} is already registered in the system.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
