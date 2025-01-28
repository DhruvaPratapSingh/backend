import mongoose,{Schema} from "mongoose";

const tweetSchema=new Schema({},{timestamps:true});

export const Tweet=mongoose.model("Tweet",tweetSchema);