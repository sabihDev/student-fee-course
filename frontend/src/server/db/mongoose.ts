import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGO_URI) {
  console.warn('MONGO_URI not set. Please set MONGO_URI environment variable.');
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
    cached.promise = mongoose.connect(MONGO_URI!, { maxPoolSize: 10 }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  (global as any)._mongoose = cached;
  return cached.conn;
}
