import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB=async()=>{
    try {
       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`) 
       console.log(`mongodb connected successfully DB Host:${DB_NAME}`);
    //    console.log(`mongodb connected successfully DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongodb connection err",error);
        process.exit(1);
    }
}
export default connectDB;