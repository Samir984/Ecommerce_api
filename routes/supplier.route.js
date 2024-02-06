import express from "express";

const supplierRouter = express.Router();

supplierRouter.route("/register").post();

export default supplierRouter;
