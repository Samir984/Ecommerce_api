import { uploadImageOnCloudinary } from "../libs/cloudinary.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const createStore = asyncHandler(async (req, res) => {
  const seller_id = req.user._id;
  const { storeName } = req.body;
  if (!storeName) throw AppError(400, "all field are required");
  const storeImgLocalPath = req?.file?.path;
  console.log("enter");

  const storeImage =
    storeImgLocalPath &&
    (await uploadImageOnCloudinary(storeImgLocalPath, `stores`));
  if (!storeImage) throw new AppError(500, "store img upload fail");

  const store = await Store.create({
    storeName,
    storeImage: {
      url: storeImage.url,
      public_id: storeImage.public_id,
    },
    seller_id,
  });
  console.log(store);

  if (!store) throw new AppError(500, "store creation error");
  return res.status(201).json(new AppResponse(store));
});
