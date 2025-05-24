import {
  newOTP,
  resetPasswordValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
  updateProfileValidationSchema,
  verifyOTP,
} from "./user.validationSchemas.js";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import {
  deleteImageFromCloudinary,
  hashPassword,
  uploadImageToCloudinary,
  verifyPassword,
} from "../../helpers/uploadImageToCloudinary.js";
import sendEmailService from "../../utils/email.js";
import { clientURL } from "../../utils/statics.js";

const signUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userName, firstName, lastName, email, password, gender } = req.body;
    const image = req.file;

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

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return next(new Error("Email already exists"));
    }

    const isUserNameExists = await User.findOne({ userName });
    if (isUserNameExists) {
      return next(new Error("Username already exists"));
    }

    const hashPass = await hashPassword(password);

    let imageUrl =
      "https://res.cloudinary.com/dxvpvtcbg/image/upload/v1713493679/sqlpxs561zd9oretxkki.jpg";
    let publicId = "";

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);

    newUser.otp = otp;
    newUser.otpExpiry = otpExpiry;
    await newUser.save();

    const otpMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Email Verification - OTP</h2>
        <p>Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP is valid for 60 minutes.</p>
        <p>If you did not sign up for BlogPlatform, please ignore this email.</p>
      </div>
    `;

    await sendEmailService({
      to: email,
      subject: "Verify Your Email Address",
      message: otpMessage,
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

const signInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    try {
      await signInValidationSchema.parseAsync({
        email,
        password,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const isEmailExists = await User.findOne({ email });
    if (!isEmailExists) {
      return next(new Error("Invalid login credentials"));
    }

    if (!isEmailExists.isVerified) {
      return next(new Error("Please verify your email first"));
    }
    const isPasswordMatch = await verifyPassword(
      password,
      isEmailExists.password
    );

    if (!isPasswordMatch) {
      return next(new Error("Invalid login credentials"));
    }
    const token = jwt.sign(
      {
        id: isEmailExists._id,
        email: isEmailExists.email,
        userName: isEmailExists.userName,
        role: isEmailExists.role,
      },
      process.env.LOGIN_SIG || "",
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const OTPVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    try {
      await verifyOTP.parseAsync({
        email,
        otp,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const user = await User.findOne({ email });

    if (!user) return next(new Error("User not found"));
    if (user.isVerified) return next(new Error("User already verified"));
    if (user.otp !== otp.trim()) return next(new Error("Invalid OTP"));

    const otpExpiry = user.otpExpiry ? new Date(user.otpExpiry) : new Date(0);
    if (otpExpiry < new Date())
      return next(new Error("OTP has expired. Please request a new OTP."));

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const requestNewOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    try {
      await newOTP.parseAsync({
        email,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const user = await User.findOne({ email });

    if (!user) return next(new Error("User not found"));
    if (user.isVerified) return next(new Error("User already verified"));
    const now = new Date();
    const otpExpiry = user.otpExpiry ? new Date(user.otpExpiry) : new Date(0);

    if (otpExpiry > now) {
      const remainingTime = Math.ceil(
        (otpExpiry.getTime() - now.getTime()) / 60000
      );
      return next(
        new Error(
          `Please wait ${remainingTime} minutes before requesting a new OTP.`
        )
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpiry = new Date(now.getTime() + 60 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = newOtpExpiry;
    await user.save();

    const message = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>OTP Verification</h2>
        <p>Your One-Time Password (OTP) for email verification is:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP is valid for 60 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmailService({
      to: email,
      subject: "Your OTP for BlogPlatform",
      message,
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    try {
      await newOTP.parseAsync({
        email,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const user = await User.findOne({ email });
    if (!user) return next(new Error("User not found"));
    if (!user.isVerified) return next(new Error("User not verified"));

    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires.getTime() > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (user.resetPasswordExpires.getTime() - Date.now()) / 60000
      );
      return next(
        new Error(
          `You have already requested a password reset. Please wait ${remainingTime} minutes before trying again.`
        )
      );
    }
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const clientResetURL = `${clientURL}/reset-password/${resetToken}`;

    const resetMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password for your BlogPlatform account.</p>
        <p>Please use the following code to reset your password:</p>
        <h3 style="color: #007bff;">${clientResetURL}</h3>
        <p>This code is valid for 60 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    await sendEmailService({
      to: email,
      subject: "Password Reset Request",
      message: resetMessage,
    });

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, confirmPassword, token } = req.body;

    try {
      await resetPasswordValidationSchema.parseAsync({
        password,
        confirmPassword,
        token,
      });
    } catch (validationError) {
      return next(validationError);
    }

    if (password !== confirmPassword) {
      return next(new Error("Passwords do not match"));
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return next(new Error("Invalid or expired token"));

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userID } = req.query;

    const user = await User.findById(userID).select(
      "-password -__v -otp -otpExpiry -resetPasswordToken -resetPasswordExpires -role"
    );

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id } = req.authUser!;
    const user = await User.findById(_id).select(
      "-password -__v -otp -otpExpiry -resetPasswordToken -resetPasswordExpires -role"
    );
    if (!user) return next(new Error("User not found"));

    const { userName, firstName, lastName, gender, bio } = req.body;

    try {
      await updateProfileValidationSchema.parseAsync({
        userName,
        firstName,
        lastName,
        gender,
        bio,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const isUserNameExists = await User.findOne({
      userName,
      _id: { $ne: _id },
    });

    if (isUserNameExists) {
      return next(new Error("Username already exists"));
    }

    user.userName = userName;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id } = req.authUser!;
    const user = await User.findById(_id);
    if (!user) return next(new Error("User not found"));

    if (user.image.public_id) {
      try {
        await deleteImageFromCloudinary(user.image.public_id);
      } catch (error) {
        return next(new Error("Failed to delete image from Cloudinary"));
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  signUpHandler,
  signInHandler,
  OTPVerify,
  requestNewOTP,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUser,
  deleteUser,
};
