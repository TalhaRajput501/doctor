import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI is not set");

// Reuse one connection across hot reloads and serverless invocations.
const g = global as any;
const cache: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } =
  g.__mongoose ?? (g.__mongoose = {});

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri);
  cache.conn = await cache.promise;
  return cache.conn;
}