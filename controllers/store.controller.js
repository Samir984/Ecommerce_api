import { uploadImageOnCloudinary } from "../libs/cloudinary.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const createStore = asyncHandler(async (req, res) => {
  const seller_id = req.user._id;
  const { storeName, number, address } = req.body;
  console.log(req.body, "create-store");

  // Check if a store with the same name already exists
  const existingStore = await Store.findOne({ seller_id });
  if (existingStore) {
    throw new AppError(400, "Store already exists");
  }

  // Create the store
  const store = await Store.create({
    storeName,
    number,
    address,
    seller_id,
  });

  //update user schema
  req.user.storeExits = true;
  req.user.save();

  if (!store) {
    throw new AppError(500, "Store creation error");
  }

  return res.status(201).json(new AppResponse(store));
});

export const getStore = asyncHandler(async (req, res) => {
  const seller_id = req.user._id;

  // Find the store data for the given user ID
  const storeData = await Store.findOne({ seller_id });

  // If no store data found for the user, return an error
  if (!storeData) {
    throw new AppError(404, "Store data not found");
  }

  // If store data found, return it in the response
  return res.status(200).json(new AppResponse(storeData));
});
