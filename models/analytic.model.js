import mongoose, { Schema } from "mongoose";

const analyticSchena = new Schema(
  {
    ip: String,
  },
  {
    timestamps: true,
  }
);

const Analytic = mongoose.model("Analytic", analyticSchena);
export default Analytic;
