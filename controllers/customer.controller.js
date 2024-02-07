import { uploadImageOnCloudinary } from "../libs/cloudinary.js";
import Customer from "../models/customer.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const GenerateAccessTokenAndSend = async (customer, res) => {
  console.log(customer);
  const accessToken = await customer.generateAccessToken();
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwtToken", accessToken, cookieOptions);

  res.status(200).json(new AppResponse("Customer Logged in successfully"));
};

//signup customer
export const signUpCustomer = AsyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName);
  if (!fullName || !email || !password)
    throw new AppError(400, "All fileds are required");

  const customerExit = await Customer.findOne({ email });
  if (customerExit)
    throw new AppError(409, "Account already exits, Please login");

  const avatarLocalPath = req?.file?.path;

  const avatar =
    avatarLocalPath && (await uploadImageOnCloudinary(avatarLocalPath));
  console.log(avatar);
  const createCustomer = await Customer.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: avatar?.public_id || undefined,
      url: avatar?.secure_url || undefined,
    },
  });

  if (!createCustomer)
    throw new AppError(500, "customer signup failed, please try again");

  createCustomer.password = "";

  return res.status(201).json(new AppResponse(createCustomer));
});

//signin controller
export const signInCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, "All field are required");
  }

  const customer = await Customer.findOne({
    email,
  });

  if (!customer) {
    throw new AppError(404, "Customer doesn't exist. Please signup First");
  }

  const isPasswordCorrect = await customer.comparePassword(password);
  if (!isPasswordCorrect) throw new AppError(401, "Invalid user credentials.");
  console.log(isPasswordCorrect);

  GenerateAccessTokenAndSend(customer, res);
});

export const signOutCustomer = AsyncHandler(async (req, res) => {
  res.clearCookie("jwtToken");
  res.json(new AppResponse("Successfully logout"));
});
