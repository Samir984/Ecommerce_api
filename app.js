import express from "express";

import customerRouter from "./routes/customer.route.js";

const app = express();
// Globle Middleware
app.use(express.json());

// Routes Middleware
app.use("/api/v1/customers", customerRouter);

//Error route
app.use((err, req, res, next) => {
  console.log("\n\n Error Occured 💥 \n\n");

  res.status(err.statusCode).json({
    status: "fail",
    message: err.message,
  });
});

export default app;
