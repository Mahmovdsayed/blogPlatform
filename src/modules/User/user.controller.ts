import bcrypt from "bcrypt";
import { signUpValidationSchema } from "./user.validationSchemas.js";
import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import {
  hashPassword,
  uploadImageToCloudinary,
} from "../../helpers/uploadImageToCloudinary.js";
import sendEmailService from "../../utils/email.js";

const signUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userName, firstName, lastName, email, password, gender } = req.body;
    const image = req.file;

    // Validate inputs using zod schema
    try {
      await signUpValidationSchema.parseAsync({
        userName,
        firstName,
        lastName,
        email,
        password,
        gender,
      });
    } catch (validationError) {
      return next(validationError);
    }

    // Check if email exists
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return next(new Error("Email already exists"));
    }

    // Check if username exists
    const isUserNameExists = await User.findOne({ userName });
    if (isUserNameExists) {
      return next(new Error("Username already exists"));
    }

    // Hash the password
    const hashPass = await hashPassword(password);

    // Default avatar URL
    let imageUrl =
      "https://res.cloudinary.com/dxvpvtcbg/image/upload/v1713493679/sqlpxs561zd9oretxkki.jpg";
    let publicId = "";

    // Check if image exists and has size > 0 before uploading
    if (image && image.size > 0) {
      try {
        const uploadResult = await uploadImageToCloudinary(
          image,
          userName,
          "Avatar"
        );
        if (uploadResult) {
          imageUrl = uploadResult.imageUrl;
          publicId = uploadResult.publicId;
        }
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    // Create new user instance
    const newUser = new User({
      userName,
      firstName,
      lastName,
      email,
      password: hashPass,
      gender,
      image: {
        url: imageUrl,
        public_id: publicId || null,
      },
    });

    await newUser.save();

    const message = `
  <div style="max-width:600px;margin:40px auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 0 8px rgba(0,0,0,0.1);font-family:Arial,sans-serif;color:#333;">
    <h1 style="color:#007bff;font-size:28px;margin-bottom:20px;">Welcome, ${userName}!</h1>
    <p style="font-size:16px;line-height:1.5;">Thanks for signing up to BlogPlatform. We're excited to have you onboard.</p>
    <p style="font-size:16px;line-height:1.5;">Start exploring amazing features like creating and sharing blog posts, managing your content, and connecting with others.</p>
    <a href="https://yourplatformurl.com/login" style="display:inline-block;background:#007bff;color:#fff;padding:12px 25px;border-radius:5px;text-decoration:none;margin-top:25px;font-weight:bold;" target="_blank" rel="noopener noreferrer">Get Started</a>
    <p style="font-size:16px;line-height:1.5;margin-top:25px;">If you need any help, feel free to reply to this email.</p>
    <p style="font-size:16px;line-height:1.5;">Best regards,<br/>The BlogPlatform Team</p>
    <div style="font-size:12px;color:#777;text-align:center;margin-top:30px;">&copy; 2025 BlogPlatform. All rights reserved.</div>
  </div>
`;

    await sendEmailService({
      to: email,
      subject: "Welcome to BlogPlatform!",
      message,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });

    return;
  } catch (error) {
    next(error);
  }
};

export default signUpHandler;
