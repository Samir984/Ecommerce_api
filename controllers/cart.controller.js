import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const addToCart = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { cart, totalQuantity, totalPrice } = req.body;
  if (!cart || !totalQuantity || !totalPrice)
    throw new AppError(400, "All fileds are requires");

  let ifExitCart = await Cart.findOne({ user_id });
  if (ifExitCart) {
    ifExitCart.cart = cart;
    ifExitCart.totalPrice = totalPrice;
    ifExitCart.totalQuantity = totalQuantity;
    ifExitCart = await ifExitCart.save();
  } else {
    ifExitCart = await Cart.create({
      user_id,
      cart: cart,
      totalQuantity,
      totalPrice,
    });
  }

  return res.status(200).json(new AppResponse(ifExitCart));
});
