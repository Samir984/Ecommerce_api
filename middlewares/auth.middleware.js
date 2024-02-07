import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Customer from "../models/customer.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new AppError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const customer = await Customer.findById(decodedToken?._id).select(
    "-password"
  );
  req.customer = customer;

  next();
});

export default verifyJwt;