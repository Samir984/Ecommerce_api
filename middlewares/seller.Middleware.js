import AppError from "../utils/AppError.js";

const verifySeller = (req, res, next) => {
  if (req.user.role === "SELLER") return next();
  throw next(new AppError(400, "You don't have permission to list product"));
};

export default verifySeller;
