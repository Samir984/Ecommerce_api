import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";

const app = express();
// Globle Middleware
app.use(express.json());
app.use(cookieParser());

// Routes Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/products", productRouter);
app.use("/api/v1/users/carts", cartRouter);
app.use("/api/v1/users/store", cartRouter);

//Error route
app.use((err, req, res, next) => {
  console.log("\nError route handler 💥. \n", err);
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message,
  });
});

export default app;
