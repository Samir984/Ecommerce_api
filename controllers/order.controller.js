import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { location, phoneNumber, cart, totalQuantity, totalPrice } = req.body;
  if (!location || !phoneNumber || !cart || !totalQuantity || !totalPrice)
    throw new AppError("all field are required");

    
});
