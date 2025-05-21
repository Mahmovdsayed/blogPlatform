import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import signUpHandler from "./user.controller.js";
import { signUpValidationSchema } from "./user.validationSchemas.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/signup",
  multerMiddleWareLocal({}).single("image"),
  validationMiddleware({ body: signUpValidationSchema }),
  expressAsyncHandler(signUpHandler)
);

export default router;
