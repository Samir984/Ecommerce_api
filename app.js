import express from "express";

import customerRouter from "./routes/customer.route.js";

const app = express();
// Globle Middleware
app.use(express.json());

// Routes Middleware
app.use("/api/v1/customers", customerRouter);


//Globle error route

export default app;
