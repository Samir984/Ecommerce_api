import express from "express";
import { upload } from "../libs/multer.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
import { createStore } from "../controllers/store.controller.js";
const storeRouter = express.Router();

storeRouter.use(verifiedJwt, verifySeller);
storeRouter.route("/create").post(upload.single("storeImg"), createStore);

export default storeRouter;
