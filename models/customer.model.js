import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  avatar: {
    project_id: String,
    url: String,
  },
});

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("Save");
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

customerSchema.methods = {
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },

  generateAccessToken: async function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
  },
};

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
