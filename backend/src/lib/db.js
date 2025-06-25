import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGODB_URI); // Connection
      console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}



