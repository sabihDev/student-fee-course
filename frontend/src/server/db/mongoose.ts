import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set. Please set MONGODB_URI environment variable.');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any)._mongoose as Cached || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { maxPoolSize: 10 }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  (global as any)._mongoose = cached;
  return cached.conn;
}
