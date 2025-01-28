import mongoose,{Schema} from "mongoose";

const likeSchema=new Schema({},{timestamps:true});

export const Like=mongoose.model("Like",likeSchema);