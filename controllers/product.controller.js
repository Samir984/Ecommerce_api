import { deleteAssetFromCloudinary, uploadImageOnCloudinary } from "../libs/cloudinary.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

export const listProduct = asyncHandler(async (req, res) => {
 console.log("enter")
  const seller_id = req.user._id;

  const {
    productName,
    productDescription,
    totalQuantity,
    brand,
    category,
    subCategory,
    price,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !totalQuantity ||
    !brand ||
    !category ||
    !subCategory ||
    !price
  )
    throw new Error(400, "all field are required");

  const localFilePath = req?.file?.path;

  if (!localFilePath) throw new Error(400, "product image is required");

  const productImg = await uploadImageOnCloudinary(localFilePath, "products");

  const createProduct = await Product.create({
    productName,
    productDescription,
    totalQuantity,
    brand,
    category,
    subCategory,
    price,
    productImg: {
      url: productImg?.secure_url,
      public_id: productImg?.public_id,
    },
    seller_id,
  });

  if (!createProduct) throw new AppError(500, "Product upload failed");

  return res.status(201).json(new AppResponse(createProduct));
});

export const deleteProductListing = asyncHandler(async (req, res) => {
  const { id: productToDelete } = req.params;
  
  const product = await Product.findById(productToDelete);
  if (!product) throw new AppError(400, "No product found");

  if (product.seller_id != req.user._id.toString()) {
    throw new AppError(400, "You are not authorized to delete other product");
  }
console.log(product)
  const productImgToDelete = product.productImg.public_id;

  console.log(productImgToDelete);
  const deletedProduct = await Product.findByIdAndDelete(productToDelete);
  if (!deletedProduct) throw new Error(500, "fail to delete product");
  await deleteAssetFromCloudinary(productImgToDelete);
  return res.status(200).json(new AppResponse("null"));
});
