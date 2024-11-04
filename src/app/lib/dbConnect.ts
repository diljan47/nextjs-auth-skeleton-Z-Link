"use server";

import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export async function dbConnect() {

  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {

    const cnx = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("New mongodb connection established");

    cachedConnection = cnx.connection;
    return cachedConnection;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    throw error;
  }
}

