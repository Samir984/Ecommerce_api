import express from "express";
import { upload } from "../libs/multer.js";
import { signUpCustomer } from "../controllers/customer.controller.js";
const customerRouter = express.Router();

customerRouter.route("/signup").post(upload.single("avatar"), signUpCustomer);

export default customerRouter;

