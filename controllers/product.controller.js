import {
  deleteAssetFromCloudinary,
  uploadImageOnCloudinary,
} from "../libs/cloudinary.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";


export const listProduct = asyncHandler(async (req, res) => {
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

  const storeExit = await Store.findOne({ seller_id: req.user._id });
  if (!storeExit) throw new AppError(400, "store doesn't exits");

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
    store_id: storeExit._id,
  });
  if (!createProduct) throw new AppError(500, "Product upload failed");

  //update store listed products
  storeExit.totalListedProducts += 1;
  await storeExit.save();

  return res.status(201).json(new AppResponse(createProduct));
});

//delete product listing
export const deleteProductListing = asyncHandler(async (req, res) => {
  const { id: productToDelete } = req.params;

  const product = await Product.findById(productToDelete);
  if (!product) throw new AppError(400, "No product found");

  // cheaking that valid seller is making delete request
  const store = await Store.findById(product.store_id);
  if (store.seller_id.toString() != req.user._id.toString()) {
    throw new AppError(400, "You are not authorized to delete other product");
  }

  const productImgToDelete = product.productImg.public_id;

  const deletedProduct = await Product.findByIdAndDelete(productToDelete);
  if (!deletedProduct) throw new Error(500, "fail to delete product");
  await deleteAssetFromCloudinary(productImgToDelete);

  //update store listed products
  store.totalListedProducts -= 1;
  await store.save();

  return res.status(200).json(new AppResponse("null"));
});
