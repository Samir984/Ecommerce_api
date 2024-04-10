class AppError extends Error {
  constructor(statusCode = 500, message = "Something went wrong") {
    super(message);
    console.log("message:",message)
    this.name = this.constructor.name;
    this.status = "fail";
    this.statusCode = statusCode;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
