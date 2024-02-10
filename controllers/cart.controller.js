import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const addToCart = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { cart, items } = req.body;
  if (!cart || !items) throw new AppError(400, "All fileds are requires");

  let ifExitCart = await Cart.findOne({ user_id });
  if (ifExitCart) {
    ifExitCart.cart = JSON.stringify(cart);
    ifExitCart= await ifExitCart.save();
  } else {
     ifExitCart = await Cart.create({
      user_id,
      cart: JSON.stringify(cart),
      items,
    });
  }

  console.log("\n\n", ifExitCart, "\n\n");

  return res.status(200).json(new AppResponse(ifExitCart));
});
