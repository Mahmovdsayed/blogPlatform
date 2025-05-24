import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  deleteUser,
  forgotPassword,
  getUserProfile,
  OTPVerify,
  requestNewOTP,
  resetPassword,
  signInHandler,
  signUpHandler,
  updateUser,
} from "./user.controller.js";
import {
  newOTP,
  resetPasswordValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
  verifyOTP,
} from "./user.validationSchemas.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";

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

router.get("/user", expressAsyncHandler(getUserProfile));
router.patch("/update", auth(), expressAsyncHandler(updateUser));
router.delete("/delete", auth(), expressAsyncHandler(deleteUser));

export default router;
