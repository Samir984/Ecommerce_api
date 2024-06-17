import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    orderItem: {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },

      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      deliveryCharged: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered", "on way", "cancel"],
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },

    marked: {
      type: String,
      enum: ["valid", "cancelled"],
      default: "valid",
    },

    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
