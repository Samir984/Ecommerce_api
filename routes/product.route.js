import express from "express";
import { upload } from "../libs/multer.js";
import { listProduct } from "../controllers/product.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const productRouter = express.Router();

// Secure route
productRouter.use(verifiedJwt, verifySeller);

productRouter.route("/listproduct").post(
  upload.fields([
    { name: "productImg1", maxCount: 1 },
    { name: "productImg2", maxCount: 1 },
    { name: "productImg3", maxCount: 1 },
  ]),
  listProduct
);

export default productRouter;
