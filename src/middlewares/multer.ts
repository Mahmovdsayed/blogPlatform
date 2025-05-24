/**
 * The above TypeScript code defines two multer middleware functions for handling file uploads with
 * specific image extensions.
 * @param  - 1. `multer`: The main library for handling file uploads in Node.js.
 * @returns The code snippet defines two functions `multerMiddleWareLocal` and `multerMiddleWareHost`
 * that return configured instances of Multer middleware for handling file uploads. The
 * `multerMiddleWareLocal` function returns a Multer middleware configured with memory storage, while
 * the `multerMiddleWareHost` function returns a Multer middleware configured with disk storage. Both
 * functions use a file filter to
 */
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import allowedExtensions from "../utils/allowedExtensions.js";

interface MulterMiddlewareOptions {
  extensions?: string[];
  filePath?: string;
}

export const multerMiddleWareLocal = ({
  extensions = allowedExtensions.image,
}: Pick<MulterMiddlewareOptions, "extensions">) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const ext = file.mimetype.split("/")[1];
    if (extensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Image format is not allowed!"));
    }
  };

  return multer({ storage, fileFilter });
};

export const multerMiddleWareHost = ({
  extensions = allowedExtensions.image,
}: Pick<MulterMiddlewareOptions, "extensions">) => {
  const storage = multer.diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const ext = file.mimetype.split("/")[1];
    if (extensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Image format is not allowed!"));
    }
  };

  return multer({ storage, fileFilter });
};
