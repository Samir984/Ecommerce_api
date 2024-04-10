import AppError from "../utils/AppError.js";

const verifyBuyer = (req, res, next) => {
  console.log("Vrified buyer auth", req.user.role);
  if (req.user.role === "BUYER") return next();
  throw next(new AppError(400, "you don't have add to cart privilege"));
};

export default verifyBuyer;
