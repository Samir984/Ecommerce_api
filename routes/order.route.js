import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //

import verifyBuyer from "../middlewares/buyer.middleware.js";
import { createOrder } from "../controllers/order.controller.js";
const orderRouter = express.Router();

// Secure route
orderRouter.use(verifiedJwt, verifyBuyer);

orderRouter.route("/").post(createOrder);

export default orderRouter;
