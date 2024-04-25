import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const addToCart = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { cart, stock, totalPrice } = req.body;
  if (!cart || !stock || !totalPrice)
    throw new AppError(400, "All fileds are requires");

  let ifExitCart = await Cart.findOne({ user_id });
  if (ifExitCart) {
    ifExitCart.cart = cart;
    ifExitCart.totalPrice = totalPrice;
    ifExitCart.stock = stock;
    ifExitCart = await ifExitCart.save();
  } else {
    ifExitCart = await Cart.create({
      user_id,
      cart: cart,
      stock,
      totalPrice,
    });
  }

  if (stock) {
    const user = await User.findById(user_id);
    user.notification = stock;
    await user.save();
  }

  return res.status(200).json(new AppResponse(ifExitCart));
});
