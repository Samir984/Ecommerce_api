import express from "express";

import verifiedJwt from "../middlewares/auth.middleware.js";
import verifyBuyer from "../middlewares/buyer.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

// Secure route
cartRouter.use(verifiedJwt, verifyBuyer);

cartRouter.route("/").post(addToCart);

export default cartRouter;
