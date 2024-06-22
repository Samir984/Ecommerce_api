import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const secret = "8gBm/:&EnhH.1/q";

function generateHmacSHA256Signature(message) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
}

export const makePayment = asyncHandler(async (req, res) => {
  console.log("make payment controller");
  const { totalPrice } = req.body;
  const baseUrl =
    req.hostname === "localhost"
      ? "http://localhost:5173/"
      : "https://ecommerce-cli.vercel.app/";

  console.log("\n\n\n\n\n baseUrl:", baseUrl, req.hostname);
  const amount = totalPrice;
  const tax_amount = 10;
  const total_amount = amount + tax_amount;
  const transaction_uuid = `${uuidv4()}`;
  const product_code = "EPAYTEST";
  const product_service_charge = 0;
  const product_delivery_charge = 0;
  const success_url = `${baseUrl}checkout/payment`;
  const failure_url = `${baseUrl}failure`;
  const signed_field_names = "total_amount,transaction_uuid,product_code";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = generateHmacSHA256Signature(message);

  const data = {
    amount,
    tax_amount,
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge,
    product_delivery_charge,
    success_url,
    failure_url,
    signed_field_names,
    signature,
  };

  return res.status(200).json(new AppResponse(data));
});

export const paymentSuccess = asyncHandler(async (req, res) => {
  const { data } = req.query;
  const responseBody = Buffer.from(data, "base64").toString("utf8");
  const response = JSON.parse(responseBody);

  const {
    transaction_code,
    status,
    total_amount,
    transaction_uuid,
    product_code,
    signed_field_names,
    signature,
  } = response;

  const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
  const generatedSignature = generateHmacSHA256Signature(message);
  console.log(generatedSignature === signature);
  if (generatedSignature === signature) {
    console.log("Signature is valid");
    res.status(200).json({ message: "Payment successful", response });
  } else {
    console.log("Invalid signature");
    res.status(400).json({ message: "Invalid signature" });
  }
});

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
  if (!shippingAddress || !phoneNumber || !orderItems)
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
    totalPrice: orderItem.price,
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

export const getSellerOrders = asyncHandler(async (req, res) => {
  console.log("getorders controller");
  const { store_id, page = 1, limit = 8 } = req.query;
  const offset = (page - 1) * limit;

  if (!store_id) {
    throw new AppError(400, "store_id is required");
  }

  const totalOrders = await Order.countDocuments({ store_id, marked: "valid" });

  // Fetch the paginated orders
  let orders = await Order.find({ store_id, marked: "valid" })
    .populate({
      path: "user_id",
      select: "fullName avatar.url",
    })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(Number(limit));

  if (!orders) {
    throw new AppError(500, "order fetching failed");
  }

  const lastPage = Math.ceil(totalOrders / limit);

  const statusOrder = { pending: 1, "on way": 2, delivered: 3 };
  orders = orders.sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return res.status(200).json(new AppResponse(orders, lastPage));
});

export const editSellerOrder = asyncHandler(async (req, res) => {
  console.log("edit order");
  const { status, marked } = req.body;
  const { order_id } = req.query;
  const order = await Order.findById(order_id);
  if (!order) throw new AppError(400, "fail to fetch order");
  if (status) order.status = status;
  if (marked) {
    if (marked === "cancelled") {
      order.marked = marked;
      order.status = "cancel";
      const product = await Product.findById(order.orderItem.product_id);
      console.log("order", product);
      product.stock += order.orderItem.quantity;
      await product.save();
    }
  }
  const updatedOrder = await order.save();
  return res.status(200).json(new AppResponse(updatedOrder));
});

export const getBuyersOrder = asyncHandler(async (req, res) => {
  console.log("get buyer orders");
  const user_id = req.user._id;
  const order = await Order.find({ user_id });
  return res.status(200).json(new AppResponse(order));
});

export const cancelledOrder = asyncHandler(async (req, res) => {
  console.log("cancel order");

  const { order_id } = req.query;

  const order = await Order.findOne({ _id: order_id });
  console.log(order);
  if (!order) {
    return res
      .status(404)
      .json(new AppResponse({ status: "error", message: "Order not found" }));
  }

  order.marked = "cancelled";
  order.status = "cancel";

  await order.save();

  res.status(200).json(
    new AppResponse({
      status: "success",
      message: "Order cancelled successfully",
    })
  );
});
