import mongoose,{Schema} from "mongoose";

const commentSchmea=new Schema({},{Timestamp:true})

export const Comment=mongoose.model("Comment",commentSchmea);