class AppError extends Error {
  constructor(message = "Something went wrong", statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = "fail";
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
