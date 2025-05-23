import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  forgotPassword,
  OTPVerify,
  requestNewOTP,
  resetPassword,
  signInHandler,
  signUpHandler,
} from "./user.controller.js";
import {
  newOTP,
  resetPasswordValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
  verifyOTP,
} from "./user.validationSchemas.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/signup",
  multerMiddleWareLocal({}).single("image"),
  validationMiddleware({ body: signUpValidationSchema }),
  expressAsyncHandler(signUpHandler)
);

router.post(
  "/signin",
  validationMiddleware({ body: signInValidationSchema }),
  expressAsyncHandler(signInHandler)
);

router.post(
  "/verifyOTP",
  validationMiddleware({ body: verifyOTP }),
  expressAsyncHandler(OTPVerify)
);

router.post(
  "/request-new-otp",
  validationMiddleware({ body: newOTP }),
  expressAsyncHandler(requestNewOTP)
);

router.post(
  "/forgot-password",
  validationMiddleware({ body: newOTP }),
  expressAsyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  validationMiddleware({ body: resetPasswordValidationSchema }),
  expressAsyncHandler(resetPassword)
);

export default router;
