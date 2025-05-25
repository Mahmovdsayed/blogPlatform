import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { AddBlogSchema, updateBlogSchema } from "./blog.validationSchemas.js";
import {
  deleteImageFromCloudinary,
  uploadBannerToCloudinary,
} from "../../helpers/uploadImageToCloudinary.js";
import Blog from "../../DB/Models/blog.model.js";

const addBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id } = req.authUser!;
    const user = await User.findById(_id);
    if (!user) return next(new Error("User not found"));

    const { title, content, topics, category, seo, isPublished } = req.body;
    const image = req.file;

    try {
      await AddBlogSchema.parseAsync({
        title,
        content,
        topics,
        category,
        seo,
        isPublished,
        image,
      });
    } catch (validationError) {
      return next(validationError);
    }

    let imageUrl =
      "https://res.cloudinary.com/dxvpvtcbg/image/upload/v1744531619/gw1ynmeg1wkxq9mslbe4.svg";
    let publicId = "";

    if (image && image.size > 0) {
      try {
        const uploadResult = await uploadBannerToCloudinary(
          image,
          user.userName,
          "blogs"
        );
        if (uploadResult) {
          imageUrl = uploadResult.imageUrl;
          publicId = uploadResult.publicId;
        }
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    const newBlog = new Blog({
      title,
      content,
      topics,
      category,
      seo,
      isPublished,
      image: {
        url: imageUrl,
        publicId: publicId || null,
      },
      author: _id,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id } = req.authUser!;
    const user = await User.findById(_id);
    if (!user) return next(new Error("User not found"));

    const { blogId } = req.query;
    const blog = await Blog.findById(blogId);
    if (!blog) return next(new Error("Blog not found"));

    if (blog.author.toString() !== _id.toString())
      return next(new Error("You are not authorized to update this blog"));

    const { title, content, topics, category, seo, isPublished } = req.body;

    try {
      await updateBlogSchema.parseAsync({
        title,
        content,
        topics,
        category,
        seo,
        isPublished,
      });
    } catch (validationError) {
      return next(validationError);
    }

    const updates = { title, content, topics, category, seo, isPublished };

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        blog[key] = value;
      }
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id } = req.authUser!;
    const user = await User.findById(_id);
    if (!user) return next(new Error("User not found"));

    const { blogId } = req.query;
    const blog = await Blog.findById(blogId);
    if (!blog) return next(new Error("Blog not found"));

    if (blog.author.toString() !== _id.toString())
      return next(new Error("You are not authorized to delete this blog"));

    if (blog.image.public_id) {
      try {
        await deleteImageFromCloudinary(blog.image.public_id);
      } catch (error) {
        return next(new Error("Failed to delete image from Cloudinary"));
      }
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getSingleBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { blogID } = req.query;

    const blog = await Blog.findById(blogID);
    if (!blog) return next(new Error("Blog not found"));

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userID } = req.query;
    const user = await User.findById(userID);
    if (!user) return next(new Error("User not found"));

    const blogs = await Blog.find({ author: userID });
    if (!blogs) return next(new Error("Blogs not found"));

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export { addBlog, updateBlog, deleteBlog, getSingleBlog, getAllBlogs };
