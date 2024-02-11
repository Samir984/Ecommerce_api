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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        // default: ""
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeschema);
export default Store;
