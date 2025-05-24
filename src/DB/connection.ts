/**
 * The function `db_connection` establishes a connection to a MongoDB database using Mongoose in a
 * TypeScript environment.
 */
import mongoose from "mongoose";

const db_connection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL || "");
    console.log("DB connected successfully ✅");
  } catch (err) {
    console.error("DB connection failed", err);
  }
};

export default db_connection;
