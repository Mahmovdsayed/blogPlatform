import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../DB/Models/user.model.js";

interface AuthRequest extends Request {
  authUser?: {
    _id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const auth = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accesstoken = req.headers.accesstoken as string | undefined;

      if (!accesstoken) {
        const error = new Error("please login first");
        (error as any).status = 400;
        return next(error);
      }

      if (!accesstoken.startsWith(process.env.TOKEN_PREFIX || "")) {
        const error = new Error("invalid token prefix");
        (error as any).status = 400;
        return next(error);
      }

      const token = accesstoken.split(process.env.TOKEN_PREFIX || "")[1];
      if (!token) {
        const error = new Error("token missing after prefix");
        (error as any).status = 400;
        return next(error);
      }

      const decodedData = jwt.verify(token, process.env.LOGIN_SIG || "") as {
        id?: string;
      };

      if (!decodedData || !decodedData.id) {
        const error = new Error("invalid token payload");
        (error as any).status = 400;
        return next(error);
      }

      // Find user by ID
      const findUser = await User.findById(
        decodedData.id,
        "_id username email createdAt updatedAt"
      );
      if (!findUser) {
        const error = new Error("please signUp first");
        (error as any).status = 404;
        return next(error);
      }

      // Attach user to request object
      req.authUser = findUser;
      next();
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("catch error in auth middleware");
      (err as any).status = 500;
      next(err);
    }
  };
};
