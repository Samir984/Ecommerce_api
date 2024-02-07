import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

const app = express();
// Globle Middleware
app.use(express.json());
app.use(cookieParser());

// Routes Middleware
app.use("/api/v1/users", userRouter);

//Error route
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: "fail",
    message: err.message,
  });
});

export default app;
