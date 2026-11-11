import mongoose from 'mongoose';

let cachedPromise = null;

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    }).then((conn) => {
      console.log('MongoDB connected');
      return conn;
    }).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }
  await cachedPromise;
}
