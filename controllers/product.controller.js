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
    stock,
    brand,
    category,
    subCategory,
    price,
    keyword,
  } = req.body;

  console.log("list product controller");

  if (
    !productName ||
    !productDescription ||
    !stock ||
    !brand ||
    !category ||
    !subCategory ||
    !price
  ) {
    throw new AppError(400, "All fields are required");
  }

  const storeExists = await Store.findOne({ seller_id });
  if (!storeExists) {
    throw new AppError(400, "Store doesn't exist");
  }

  const productImgBuffer = req?.file?.buffer;

  if (!productImgBuffer) {
    throw new AppError(400, "Product image is required");
  }

  const productImg = await uploadImageOnCloudinary(
    productImgBuffer,
    "products"
  );

  if (!productImg) {
    throw new AppError(500, "Error while uploading product image");
  }

  const createProduct = await Product.create({
    productName,
    productDescription,
    stock,
    brand,
    category,
    subCategory,
    price,
    keyword,
    productImg: {
      url: productImg.secure_url,
      public_id: productImg.public_id,
    },
    store_id: storeExists._id,
  });

  if (!createProduct) {
    throw new AppError(500, "Failed to create product");
  }

  // Update store's totalListedProducts
  storeExists.totalListedProducts += 1;
  await storeExists.save();

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


export const editProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { oldImg } = req.body;

  let updatedData = { ...req.body };

  // Handle image update
  if (oldImg) {
    await deleteAssetFromCloudinary(oldImg.public_id);

    const productImgBuffer = req?.file?.buffer;
    if (!productImgBuffer) {
      throw new AppError(400, "Product image is required");
    }

    const updatedProductImg = await uploadImageOnCloudinary(
      productImgBuffer,
      "products"
    );
    updatedData.productImg = {
      url: updatedProductImg.secure_url,
      public_id: updatedProductImg.public_id,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    product_id,
    updatedData,
    { new: true }
  );

  if (!updatedProduct) {
    throw new AppError(500, "Failed to update product");
  }

  return res.status(200).json(new AppResponse(updatedProduct));
});

export const getAllSubCategories = asyncHandler(async (req, res) => {
  console.log("getAllCategories controller");
  const categories = await Product.aggregate([
    {
      $group: {
        _id: "$subCategory",
        url: { $first: "$productImg.url" },
      },
    },
  ]);
  res.status(200).json(new AppResponse(categories));
});
export const getProductsAsQuery = asyncHandler(async (req, res) => {
  console.log("getAllCategories controller");
  const { query, sortbyprice, brand, limit, page, subcategory } = req.query;
  console.log(query, sortbyprice, subcategory, page, limit);

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 6;
  const offset = (pageNumber - 1) * limitNumber;

  const pipeline = [
    {
      $match: {
        keyword: { $regex: query || "", $options: "i" },
        stock: { $gt: 0 }, // Ensure stock is greater than 0
      },
    },
  ];

  if (subcategory) {
    pipeline.push({
      $match: {
        subCategory: subcategory,
      },
    });
  }
  if (brand) {
    console.log(brand);
    pipeline.push({
      $match: {
        brand: brand,
      },
    });
  }

  // Calculate total count before applying pagination and projection
  const totalCountPipeline = [...pipeline];
  const totalCount = (await Product.aggregate(totalCountPipeline)).length;
  const lastPage = Math.ceil(totalCount / limitNumber);

  if (sortbyprice) {
    pipeline.push({
      $sort: { price: sortbyprice === "asc" ? 1 : -1 },
    });
  }

  pipeline.push(
    {
      $skip: offset,
    },
    {
      $limit: limitNumber,
    },
    {
      $project: {
        _id: 1,
        productImg: 1,
        productDescription: 1,
        store_id: 1,
        productName: 1,
        price: 1,
      },
    }
  );

  console.log(pipeline);
  const products = await Product.aggregate(pipeline);

  console.log(lastPage);
  res.status(200).json(new AppResponse(products, lastPage));
});
