import AppError from "./AppError.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res,next);
    } catch (error) {
      console.log(`\nError occurred 💥. \t ${error}\n\n`);
      next(new AppError(400, error.message));
    }
  };
};

export default asyncHandler;
