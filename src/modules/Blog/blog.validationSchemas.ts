import { z } from "zod";
import allowedExtensions from "../../utils/allowedExtensions.js";

const AddBlogSchema = z.object({
  title: z.string().min(1).trim(),
  content: z.string().min(1),
  image: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
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
  topics: z
    .array(
      z.object({
        title: z.string().min(1).trim(),
        description: z.string().trim().optional(),
      })
    )
    .optional(),
  category: z.string().trim().optional(),
  views: z.number().int().nonnegative().optional(),
  seo: z
    .object({
      metaTitle: z.string().trim().optional(),
      metaDescription: z.string().trim().optional(),
    })
    .optional(),
  isPublished: z.boolean().optional(),
});

const updateBlogSchema = z.object({
  title: z.string().min(1).trim().optional(),
  content: z.string().min(1).optional(),
  topics: z
    .array(
      z.object({
        title: z.string().min(1).trim().optional(),
        description: z.string().trim().optional(),
      })
    )
    .optional(),
  category: z.string().trim().optional(),
  seo: z
    .object({
      metaTitle: z.string().trim().optional(),
      metaDescription: z.string().trim().optional(),
    })
    .optional(),
  isPublished: z.boolean().optional(),
});

export { AddBlogSchema, updateBlogSchema };
