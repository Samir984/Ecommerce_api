import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
import {
  createStore,
  getProducts,
  getStore,
} from "../controllers/store.controller.js";
const storeRouter = express.Router();

storeRouter.route("/create").post(verifiedJwt, verifySeller, createStore);
storeRouter
  .route("/getstore/:store_id")
  .get(verifiedJwt, verifySeller, getStore);

storeRouter.route("/products/").get(verifiedJwt, verifySeller, getProducts);

export default storeRouter;
