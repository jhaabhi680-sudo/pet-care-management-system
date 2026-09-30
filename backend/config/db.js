import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose
 * Demonstrates: Web Lab Experiment 5 (Install and Configure MongoDB, CRUD)
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petcare_db'
    );
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Tip: Ensure MongoDB service is running locally or check your MONGO_URI in .env');
    // Exit process with failure in production, but in local keep running for diagnostics if desired
    process.exit(1);
  }
};

export default connectDB;
