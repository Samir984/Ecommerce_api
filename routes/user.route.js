import express from "express";
import { upload } from "../libs/multer.js";
import {
  signInUser,
  signOutUser,
  signUpUser,
  updateAvatar,
} from "../controllers/user.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js";


const userRouter = express.Router();

userRouter.route("/signup").post(upload.single("avatar"), signUpUser);
userRouter.route("/signin").post(signInUser);

// Secure route

userRouter.route("/signout").post(verifiedJwt,signOutUser);
userRouter.route("/updateavatar").post(verifiedJwt,upload.single("avatar"), updateAvatar);

export default userRouter;
