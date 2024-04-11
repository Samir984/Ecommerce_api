import {
  deleteAssetFromCloudinary,
  uploadImageOnCloudinary,
} from "../libs/cloudinary.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const GenerateAccessTokenAndSend = async (user, res) => {
  const accessToken = await user.generateAccessToken();

  const userResponse = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    jwtToken: accessToken,
    store_id: user.store_id,
  };
  console.log("user", user.store_id);
  res.status(200).json(new AppResponse(userResponse));
};

//signup User
export const signUpUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;
  console.log("user1", req.body);
  if (!fullName || !email || !password) {
    throw new AppError(400, "All fileds are required");
  }

  console.log(fullName, email, "signup");

  const userExit = await User.findOne({ email });
  if (userExit) throw new AppError(409, "Account already exits, Please login");

  const avatarLocalPath = req?.file?.path;

  const avatar =
    avatarLocalPath &&
    (await uploadImageOnCloudinary(
      avatarLocalPath,
      `${role?.toLowerCase() || "buyer" + "s"}`
    ));

  const createUser = await User.create({
    fullName,
    email,
    password,
    role: role?.toUpperCase(),
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

  GenerateAccessTokenAndSend(user, res);
});

//signout user
export const signOutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwtToken");
  res.json(new AppResponse("Successfully signout"));
});

// update avatar
export const updateAvatar = asyncHandler(async (req, res) => {
  const newAavatarLocalPath = req?.file?.path;
  if (!newAavatarLocalPath) throw new AppError(400, "Avatar file is missing");

  const newAvatar = await uploadImageOnCloudinary(
    newAavatarLocalPath,
    `${req.user.role.toLowerCase() + "s"}`
  );
  if (!newAvatar) throw new AppError(400, "Error while uploading avatar");
  const avatarToDelete = req.user?.avatar.public_id;
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: {
          url: newAvatar.secure_url,
          public_id: newAvatar.public_id,
        },
      },
    },
    { new: true }
  ).select("-password");
  console.log(updatedUser);

  if (updatedUser && updatedUser.avatar.public_id) {
    await deleteAssetFromCloudinary(avatarToDelete);
  }

  return res.status(200).json(new AppResponse(updatedUser));
});
