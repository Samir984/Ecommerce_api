import express from "express";
import { upload } from "../libs/multer.js";
import {
  deleteProductListing,
  listProduct,
} from "../controllers/product.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const productRouter = express.Router();

// Secure route
productRouter.use(verifiedJwt, verifySeller);

productRouter
  .route("/listproduct")
  .post(upload.single("productImg"), listProduct);

productRouter.route("/deleteproduct/:id").delete(deleteProductListing);

export default productRouter;
