import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";
import { AddBlogSchema, updateBlogSchema } from "./blog.validationSchemas.js";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
} from "./blog.controller.js";

const blogRouter = Router();

blogRouter.post(
  "/add",
  auth(),
  multerMiddleWareLocal({}).single("image"),
  validationMiddleware({ body: AddBlogSchema }),
  expressAsyncHandler(addBlog)
);

blogRouter.patch(
  "/update",
  auth(),
  validationMiddleware({ body: updateBlogSchema }),
  expressAsyncHandler(updateBlog)
);

blogRouter.delete("/delete", auth(), expressAsyncHandler(deleteBlog));
blogRouter.get("/", expressAsyncHandler(getSingleBlog));
blogRouter.get("/all", expressAsyncHandler(getAllBlogs));

export default blogRouter;
