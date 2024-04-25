import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cart: {
      type: [
        {
          productName: {
            type: String,
            required: true,
          },
          productImg: {
            type: String,
            required: "true",
          },
          quantity: {
            type: Number,
            required: true,
          },
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          store_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
          },
          totalPrice: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
