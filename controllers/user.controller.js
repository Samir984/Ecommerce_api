import { uploadImageOnCloudinary } from "../libs/cloudinary.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const GenerateAccessTokenAndSend = async (user, res) => {
  const accessToken = await user.generateAccessToken();
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwtToken", accessToken, cookieOptions);

  res.status(200).json(new AppResponse("User Logged in successfully"));
};

//signup User
export const signUpUser = AsyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;
  console.log(fullName);
  if (!fullName || !email || !password)
    throw new AppError(400, "All fileds are required");

  const userExit = await User.findOne({ email });
  if (userExit) throw new AppError(409, "Account already exits, Please login");

  const avatarLocalPath = req?.file?.path;

  const avatar =
    avatarLocalPath && (await uploadImageOnCloudinary(avatarLocalPath));
  console.log(avatar);
  const createUser = await User.create({
    fullName,
    email,
    password,
    role,
    avatar: {
      public_id: avatar?.public_id || undefined,
      url: avatar?.secure_url || undefined,
    },
  });

  if (!createUser)
    throw new AppError(500, "User signup failed, please try again");

  createUser.password = "";

  return res.status(201).json(new AppResponse(createUser));
});

//signin controller
export const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, "All field are required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new AppError(404, "User doesn't exist. Please signup First");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new AppError(401, "Invalid user credentials.");
  console.log(isPasswordCorrect);

  GenerateAccessTokenAndSend(user, res);
});

export const signOutUser = AsyncHandler(async (req, res) => {
  res.clearCookie("jwtToken");
  res.json(new AppResponse("Successfully signout"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const newAavatarLocalPath = req?.file?.path;
  if (!newAavatarLocalPath) throw new AppError(400, "Avatar file is missing");

  const newAvatar = await uploadImageOnCloudinary(newAavatarLocalPath);
  if (!newAvatar) throw new AppError(400, "Error while uploading avatar");

  const user = await User.findById(req.user._id).select("avatar");

  
});
