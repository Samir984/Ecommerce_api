import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //

import verifyBuyer from "../middlewares/buyer.middleware.js";
import {
  cancelledOrder,
  createOrder,
  editSellerOrder,
  getBuyersOrder,
  getSellerOrders,
} from "../controllers/order.controller.js";
import verifySeller from "../middlewares/seller.Middleware.js";
const orderRouter = express.Router();

orderRouter.route("/createorder/").post(verifiedJwt, verifyBuyer, createOrder);
orderRouter
  .route("/seller/orders")
  .get(verifiedJwt, verifySeller, getSellerOrders);
orderRouter
  .route("/buyer/orders")
  .get(verifiedJwt, verifyBuyer, getBuyersOrder);
orderRouter
  .route("/seller/orders")
  .patch(verifiedJwt, verifySeller, editSellerOrder);

orderRouter
  .route("/buyer/orders/cancel")
  .get(verifiedJwt, verifyBuyer, cancelledOrder);

export default orderRouter;
