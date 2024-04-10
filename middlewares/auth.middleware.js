import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import User from "../models/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new AppError(401, "Unauthorized request:: Acess Token not found");
  }

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select("-password");

  req.user = user;
  console.log("Auth successful",req.user)
  next();
});

export default verifyJwt;
