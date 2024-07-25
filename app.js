import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import storeRouter from "./routes/store.route.js";
import cors from "cors";
import helmet from "helmet";
import Analytic from "./models/analytic.model.js";

const app = express();

// Globle Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",
  })
);

let requestCount = 0;
app.use(async (req, res, next) => {
  requestCount++;
  console.log(`Total requests: ${requestCount}`);

  const userIp = req.ip;

  const userExists = await Analytic.findOne({ ip: userIp });

  if (!userExists) {
   await Analytic.create({ ip: userIp });
  }

  next();
});

// Routes Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/orders", orderRouter);

//test
app.get("/", (req, res) => {
  console.log("all good");
  res.status(200).json({
    status: "success",
    data: "all good on server",
  });
});

//Error route
app.use((err, req, res, next) => {
  console.log("\nError route handler 💥. \n", err);
  console.log("Error message", err.message);
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message,
  });
});

export default app;
