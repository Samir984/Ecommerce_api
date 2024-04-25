import express from "express";
import { upload } from "../libs/multer.js";
import {
  deleteProductListing,
  editProduct,
  getAllSubCategories,
  getProductById,
  getProductsAsQuery,
  listProduct,
} from "../controllers/product.controller.js";
import verifiedJwt from "../middlewares/auth.middleware.js"; //
import verifySeller from "../middlewares/seller.Middleware.js";
const productRouter = express.Router();

productRouter.route("/").get(getProductsAsQuery);
productRouter.route("/subcategories").get(getAllSubCategories);

productRouter.route("/:product_id").get(getProductById);

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


export default productRouter;
