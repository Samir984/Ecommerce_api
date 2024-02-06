import express from "express";

const customerRouter = express.Router();

customerRouter.route("/register").post();

export default customerRouter;
