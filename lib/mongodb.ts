import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log("📌 MongoDB connecté");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ Erreur MongoDB :", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
