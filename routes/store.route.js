import express from "express";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
import { createStore,getStore } from "../controllers/store.controller.js";
const storeRouter = express.Router();

storeRouter.use(verifiedJwt, verifySeller);
storeRouter.route("/create").post(createStore);
storeRouter.route("/getstore/:store_id").get(getStore);

export default storeRouter;
