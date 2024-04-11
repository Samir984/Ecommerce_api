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
  const storeExits = await Store.findOne({ seller_id });
  if (storeExits) {
    throw new AppError(400, "Store already exists");
  }

  // Create the store
  const store = await Store.create({
    storeName,
    number,
    address,
    seller_id,
  });

  if (!store) throw new AppError(500, " fail to create store ");
  //update user schema
  req.user.store_id = store._id;
  const r = await req.user.save();

  console.log("see this ->", store, r);

  if (!store) {
    throw new AppError(500, "Store creation error");
  }

  return res.status(201).json(new AppResponse(store));
});

export const getStore = asyncHandler(async (req, res) => {
  const { store_id } = req.params;

  // Find the store data for the given user ID
  const storeData = await Store.findById(store_id);

  // If no store data found for the user, return an error
  if (!storeData) {
    throw new AppError(404, "Store data not found");
  }

  // If store data found, return it in the response
  return res.status(200).json(new AppResponse(storeData));
});
