import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env
dotenv.config();

// Establish database connection
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API (Web Lab Experiment 8 testing)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Pet Care Management System REST API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// REST API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// 404 and Global Error Handling (Web Lab Experiment 20)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PetCare Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
});
