import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import ImageSchema from "./image.model.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: ImageSchema,
    bio: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
