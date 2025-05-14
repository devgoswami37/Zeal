import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI =process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
const MONGODBURI = process.env.MONGODB_URI;
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    console.log("Creating new database connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    });
  }

  try {
    console.log("Awaiting database connection...");
    cached.conn = await cached.promise;
    console.log("Database connection established");
  } catch (e) {
    console.error("Error connecting to the database:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
export const connectToDatabase = dbConnect