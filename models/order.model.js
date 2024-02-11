import mongoose from "mongoose";

const orderScema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
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
          seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    totalQuantity: {
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

const Order = mongoose.model("Order", orderScema);
export default Order;
