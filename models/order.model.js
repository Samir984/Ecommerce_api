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
    quantity: {
      type: Number,
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    extraPrice: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderScema);
export default Order;
