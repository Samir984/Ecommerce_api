import Order from "../models/order.model.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  console.log('enter')
  const { location, phoneNumber, quantity, store_id, product_id, extraPrice } =
    req.body;
  if (!location || !phoneNumber || !quantity || !store_id || !product_id)
    throw new AppError("all field are required");

  const order = await Order.create({
    user_id,
    location,
    phoneNumber,
    quantity,
    store_id,
    product_id,
    extraPrice,
  });
  if (!order) throw new AppError(500, "fail to create order");

  const updateStore = await Store.findByIdAndUpdate(store_id, {
    $inc: { totalReceivedOrder: 1 },
  });

  return res.status(201).json(new AppResponse("Order made successfully"));
});
