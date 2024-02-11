import mongoose, { Schema } from "mongoose";

const storeschema = new Schema(
  {
    storeName: {
      type: String,
      required: "true",
    },
    storeImage: {
      type: String,
      default: "",
    },

    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prodcuts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeschema);
export default Store;
