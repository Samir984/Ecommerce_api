import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: string,
    required: true,
  },
  productDescription: {
    type: string,
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
      url: String,
      public_id: String,
    },
    img2: {
      url: String,
      public_id: String,
    },
    img3: {
      url: String,
      public_id: String,
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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
