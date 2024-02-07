import express from "express";

import customerRouter from "./routes/customer.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
// Globle Middleware
app.use(express.json());
app.use(cookieParser());

// Routes Middleware
app.use("/api/v1/customers", customerRouter);

//Error route
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: "fail",
    message: err.message,
  });
});

export default app;
