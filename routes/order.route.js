import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //

import verifyBuyer from "../middlewares/buyer.middleware.js";
import { createOrder, getorders } from "../controllers/order.controller.js";
import verifySeller from "../middlewares/seller.Middleware.js";
const orderRouter = express.Router();

orderRouter.route("/").post(verifiedJwt, verifyBuyer, createOrder);
orderRouter.route("/").get(verifiedJwt, verifySeller, getorders);

export default orderRouter;
