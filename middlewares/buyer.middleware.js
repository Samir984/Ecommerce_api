import AppError from "../utils/AppError.js";

const verifyBuyer = (req, res, next) => {
  if (req.user.role === "BUYER") return next();
  throw next(new AppError(400, "you don't have add to cart privilege"));
};

export default verifyBuyer;
