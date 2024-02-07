import AppError from "./AppError.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      console.log("async");
      await requestHandler(req, res, next);
    } catch (error) {
      console.log(`\nError occurred 💥. \t ${error}\n\n`);
      next(new AppError(500, error.message));
    }
  };
};

export default asyncHandler;
