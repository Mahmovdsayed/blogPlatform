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

export { signUpValidationSchema };
