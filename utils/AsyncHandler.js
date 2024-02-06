export default asynnHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.Message || "Internal server Error";
      res.status(statusCode).json({
        status: "fail",
        error: errorMessage,
      });
    }
  };
};
