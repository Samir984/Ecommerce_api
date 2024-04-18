import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //

import verifyBuyer from "../middlewares/buyer.middleware.js";
import { createOrder } from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.route("/").post(verifiedJwt, verifyBuyer, createOrder);

export default orderRouter;
