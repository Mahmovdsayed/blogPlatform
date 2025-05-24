import { z } from "zod";
import allowedExtensions from "../../utils/allowedExtensions.js";

const signUpValidationSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),

  firstName: z
    .string()
    .trim()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(20, { message: "First name must be at most 20 characters" })
    .regex(/^[A-Za-z]+$/, {
      message: "First name can only contain letters",
    })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  lastName: z
    .string()
    .trim()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(20, { message: "Last name must be at most 20 characters" })
    .regex(/^[A-Za-z]+$/, {
      message: "Last name can only contain letters",
    })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  image: z
    .any()
    .refine(
      (file) => {
        if (!file) return true; // optional
        const fileName = file?.name || "";
        const extension = fileName.split(".").pop()?.toLowerCase();
        return (
          file instanceof File &&
          extension &&
          allowedExtensions.image.includes(extension)
        );
      },
      {
        message: "Only image files (jpg, jpeg, png) are allowed",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024;
      },
      {
        message: "Image size should be less than 5MB",
      }
    )
    .optional(),
  gender: z.enum(["male", "female"]).optional().default("male"),

  role: z.enum(["user", "admin"]).optional().default("user"),
});

const signInValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

const verifyOTP = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
  otp: z
    .string()
    .trim()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" }),
});

const newOTP = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
});

const resetPasswordValidationSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(30, { message: "Password must be at most 30 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" })
      .max(30, { message: "Confirm password must be at most 30 characters" }),
    token: z
      .string()
      .trim()
      .min(6, { message: "Reset token must be 6 digits" })
      .max(6, { message: "Reset token must be 6 digits" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updateProfileValidationSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    })
    .optional(),

  firstName: z
    .string()
    .trim()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(20, { message: "First name must be at most 20 characters" })
    .regex(/^[A-Za-z]+$/, {
      message: "First name can only contain letters",
    })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(20, { message: "Last name must be at most 20 characters" })
    .regex(/^[A-Za-z]+$/, {
      message: "Last name can only contain letters",
    })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .optional(),
  gender: z.enum(["male", "female"]).optional().default("male").optional(),
  bio: z.string().trim().optional(),
});

export {
  signUpValidationSchema,
  signInValidationSchema,
  verifyOTP,
  newOTP,
  resetPasswordValidationSchema,
  updateProfileValidationSchema,
};
