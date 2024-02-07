import express from "express";
import { upload } from "../libs/multer.js";
import {
  signInCustomer,
  signOutCustomer,
  signUpCustomer,
} from "../controllers/customer.controller.js";
import verfiedJwt from "../middlewares/auth.middleware.js";
const customerRouter = express.Router();

customerRouter.route("/signup").post(upload.single("avatar"), signUpCustomer);

customerRouter.route("/signin").post(signInCustomer);

//secure route
customerRouter.route("/signout").get(verfiedJwt, signOutCustomer);

export default customerRouter;
