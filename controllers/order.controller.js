import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  console.log("createOrder Controller");
  const {
    shippingAddress,
    phoneNumber,
    orderItems,
    paymentMethod,
    totalPrice,
  } = req.body;
  if (
    !shippingAddress ||
    !phoneNumber ||
    !orderItems ||
    !paymentMethod ||
    !totalPrice
  )
    throw new AppError("all field are required");
  const orders = orderItems.map((orderItem) => ({
    user_id,
    store_id: orderItem.store_id,
    orderItem: {
      name: orderItem.productName,
      quantity: orderItem.quantity,
      image: orderItem.url,
      price: orderItem.price,
      product_id: orderItem.product_id,
    },
    shippingAddress,
    totalPrice,
    phoneNumber,
    paymentMethod,
  }));

  console.log(orders);
  const createdOrders = await Order.insertMany(orders);
  if (!createdOrders) throw new AppError(404, "fail to create order");

  const updateOrderCount = orderItems.map((orderItem) =>
    Store.findOneAndUpdate(
      { _id: orderItem.store_id },
      { $inc: { totalReceivedOrder: 1 } },
      { new: true }
    )
  );

  await Promise.all(updateOrderCount);
  if (!updateOrderCount) throw new AppError(404, "fail to update count");

  const decreateProductCount = orderItems.map((orderItem) =>
    Product.findOneAndUpdate(
      { _id: orderItem.product_id },
      { $inc: { stock: -orderItem.quantity } },
      { new: true }
    )
  );
  await Promise.all(decreateProductCount);
  if (!decreateProductCount) throw new AppError(404, "fail to update stock");

  return res.status(201).json(new AppResponse(createdOrders));
});

export const getorders = asyncHandler(async (req, res) => {
  console.log("getorders controller");
  const { store_id } = req.query;
  if (!store_id)
    res.status(400).json(new AppError(400, "store_id is required"));

  const orders = await Order.find({ store_id }).populate({
    path: "user_id",
    select: "fullName",
  });
  if (!orders) res.status(400).json(new AppError(400, "Error fetching orders"));
  return res.status(200).json(new AppResponse(orders));
});
