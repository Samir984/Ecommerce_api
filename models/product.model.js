import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "quantity can't be 0",
      },
    },
    productImg: {
      img1: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
      img2: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
      img3: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seller_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
