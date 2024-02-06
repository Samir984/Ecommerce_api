import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./db/index.js";
import app from "./app.js";

const port = process.env.PORT || 8000;
dbConnect().then(() =>
  app.listen(port, () => {
    console.log("Server started listening 🗄️ .\n\n");
  })
);
