import express from "express"
import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path:"./env"
})
const app=express();
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`connection is running at port ${PORT}`);
})
connectDB();



