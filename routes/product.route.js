import express from "express";
import { upload } from "../libs/multer.js";
import {
  deleteProductListing,
  editProduct,
  getProductById,
  getProducts,
  listProduct,
} from "../controllers/product.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const productRouter = express.Router();

// Secure route
productRouter.use(verifiedJwt, verifySeller);

productRouter
  .route("/listproduct/")
  .post(upload.single("productImg"), listProduct);

productRouter.route("/:product_id").patch(upload.single("productImg"),editProduct);
productRouter.route("/:product_id").delete(deleteProductListing);

productRouter.route("/:product_id").get(getProductById);
productRouter.route("/").get(getProducts);

export default productRouter;
