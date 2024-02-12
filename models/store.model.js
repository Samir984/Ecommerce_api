import mongoose, { Schema } from "mongoose";

const storeschema = new Schema(
  {
    storeName: {
      type: String,
      required: "true",
    },
    storeImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalListedProducts: {
      type: Number,
      default: 0,
    },

    totalReceivedOrder: {
      type: Number,
      default: 0,
    },

    monitization: {
      type: String,
      enum: ["on", "off"],
      default: "off",
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeschema);
export default Store;
