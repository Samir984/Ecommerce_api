import { uploadImageOnCloudinary } from "../libs/cloudinary.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const listProduct = asyncHandler(async (req, res) => {
  console.log("enter");
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

    console.log(req?.files)
  const localFilePath1 = req?.files?.productImg1[0].path;
  const localFilePath2 = req?.files?.productImg2[0].path;
  const localFilePath3 = req?.files?.productImg3[0].path;
  if (!localFilePath1 || !localFilePath2 || !localFilePath3)
    throw new Error(400, "all three product image are required");

  const uploadPromises = [
    uploadImageOnCloudinary(localFilePath1, "products"),
    uploadImageOnCloudinary(localFilePath2, "products"),
    uploadImageOnCloudinary(localFilePath3, "products"),
  ];
  const [productImg1, productImg2, productImg3] = await Promise.all(
    uploadPromises
  );

  const createProduct = await Product.create({
    productName,
    productDescription,
    totalQuantity,
    brand,
    category,
    subCategory,
    price,
    productImg: {
      img1: {
        url: productImg1?.secure_url,
        public_id: productImg1?.public_id,
      },
      img2: {
        url: productImg2?.secure_url,
        public_id: productImg2?.public_id,
      },
      img3: {
        url: productImg3?.secure_url,
        public_id: productImg3?.public_id,
      },
    },
    seller_id,
  });

  if (!createProduct) throw new AppError(500, "Product upload failed");

  return res.status(201).json(new AppResponse(createProduct));
});
