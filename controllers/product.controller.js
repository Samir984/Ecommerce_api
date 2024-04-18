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

  console.log("list product controller");

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
  console.log(req.user._id);
  const storeExits = await Store.findOne({ seller_id: req.user._id });

  console.log(storeExits);
  if (!storeExits) throw new AppError(400, "store doesn't exits");

  const localFilePath = req?.file?.path;

  if (!localFilePath) throw new Error(400, "product image is required");

  const productImg = await uploadImageOnCloudinary(localFilePath, "products");

  if (!productImg) throw new AppError(500, "Error while uploading Products");
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
    store_id: storeExits._id,
  });
  if (!createProduct) throw new AppError(500, "Product upload failed");

  //update store listed products

  storeExits.totalListedProducts += 1;
  storeExits.save();

  return res.status(201).json(new AppResponse(createProduct));
});

//delete product listing
export const deleteProductListing = asyncHandler(async (req, res) => {
  const { product_id: productToDelete } = req.params;

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

  //update store listed productsz
  store.totalListedProducts -= 1;
  await store.save();

  return res.status(200).json(new AppResponse("null"));
});

//get Product per id

export const getProductById = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  const product = await Product.findById(product_id);
  console.log(product);
  if (!product) res.status(404).json(new AppError(404, "Product not found"));

  return res.status(200).json(new AppResponse(product));
});

//get products per page
export const getProducts = asyncHandler(async (req, res) => {
  const { store_id, page, limit } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;
  const totalCount = await Product.countDocuments({ store_id });
  const lastPage = Math.ceil(totalCount / limitNumber);
  console.log(
    "PageNumber:",
    pageNumber,
    "limitNumber:",
    limitNumber,
    "offset:",
    offset
  );
  let products = await Product.find({ store_id })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limitNumber)
    .select("_id price _id productImg productName store_id");

  return res.status(200).json(new AppResponse(products, lastPage));
});

export const editProduct = asyncHandler(async (req, res) => {
  console.log("editProduct", req.body);
  const { product_id } = req.params;
  const { productImg, store_id, oldImg } = req.body;

  let updatedData = null;
  //handel image
  if (oldImg) {
    await deleteAssetFromCloudinary(oldImg.public_id);
    const localFilePath = req?.file?.path;
    if (!localFilePath) throw new Error(400, "product image is required");

    const updatedProduct = await uploadImageOnCloudinary(
      localFilePath,
      "products"
    );
    updatedData = {
      ...req.body,
      productImg: {
        url: updatedProduct?.secure_url,
        public_id: updatedProduct?.public_id,
      },
    };
  } else {
    updatedData = { ...req.body };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    product_id,
    updatedData,
    { new: true }
  );

  if (!updatedProduct) throw new AppError(500, "Product upload failed");
  return res.status(201).json(new AppResponse(updatedProduct));
});


export const getAllCategories = asyncHandler(async (req, res) => {
  console.log("getAllCategories controller");
  const categories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
      }
    },
  ]);
  res.status(200).json(new AppResponse(categories));
});
