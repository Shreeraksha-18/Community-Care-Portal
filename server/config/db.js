import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // don't hang if local mongodb isn't running
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection note: ${error.message}`);
    console.warn('ℹ️ Running in memory/offline mode until MongoDB is connected.');
  }
};

export default connectDB;
