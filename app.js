import express from "express";

const app = express();
// Globle Middleware
app.use(express.json());

// Routes Middleware
// app.use("api/v1/vendor");

export default app;
