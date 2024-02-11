import express from "express";
import { upload } from "../libs/multer.js";

import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const storeRouter = express.Router();

storeRouter.use(verifiedJwt, verifySeller);
storeRouter.route("/createstore").post(upload.single("avatar"), updateAvatar);

export default storeRouter;
