import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multi-game-auction', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(` MongoDB Connection Warning: ${error.message}`);
    console.warn(` Server is running in memory/standby mode for database. Ensure MongoDB is running on ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multi-game-auction'}`);
    return null;
  }
};

