import mongoose from "mongoose";
import { ENV_CONGIG } from "./env.config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_CONGIG.MONGO_URI);
    console.log("DB connection established:" + conn.connection.host);
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    process.exit(1);
  }
};
