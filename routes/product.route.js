import express from "express";
import { upload } from "../libs/multer.js";
import {
  deleteProductListing,
  editProduct,
  getAllCategories,
  getProductById,
  getProducts,
  listProduct,
} from "../controllers/product.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const productRouter = express.Router();

productRouter.route("/categories").get(getAllCategories);

// secure seller route
productRouter
  .route("/listproduct/")
  .post(verifiedJwt, verifySeller, upload.single("productImg"), listProduct);

productRouter
  .route("/:product_id")
  .patch(verifiedJwt, verifySeller, upload.single("productImg"), editProduct);
productRouter
  .route("/:product_id")
  .delete(verifiedJwt, verifySeller, deleteProductListing);

productRouter
  .route("/:product_id")
  .get(verifiedJwt, verifySeller, getProductById);
productRouter.route("/").get(verifiedJwt, verifySeller, getProducts);

export default productRouter;
