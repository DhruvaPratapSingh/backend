import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

import { app } from "./app.js";
dotenv.config({
  path: "./env",
});
app.get("/", (req, res) => {
  res.send("hello");
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`connection is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection Failed", err);
  });
