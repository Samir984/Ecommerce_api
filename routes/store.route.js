import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
import { createStore,getStore } from "../controllers/store.controller.js";
const storeRouter = express.Router();


storeRouter.route("/create").post(verifiedJwt, verifySeller,createStore);
storeRouter.route("/getstore/:store_id").get(verifiedJwt, verifySeller,getStore);

export default storeRouter;
