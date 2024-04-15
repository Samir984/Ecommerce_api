import express from "express";
import { upload } from "../libs/multer.js";
import {
  signInUser,
  signOutUser,
  signUpUser,
  updateAvatar,
} from "../controllers/user.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js";
import passport from "passport";

const userRouter = express.Router();

// google logiin
userRouter
  .route("/logging-with-google")
  .get(passport.authenticate("google", { scope: ["profile"] }));
userRouter.route("/signup").post(upload.single("avatar"), signUpUser);

userRouter.get(process.env.GOOGLE_OAUTH_DIRECT_URL).get((req, res) => {
  
});

userRouter.route("/signin").post(signInUser);

// Secure route
userRouter.use(verifiedJwt);
userRouter.route("/signout").post(signOutUser);
userRouter.route("/updateavatar").post(upload.single("avatar"), updateAvatar);

export default userRouter;
