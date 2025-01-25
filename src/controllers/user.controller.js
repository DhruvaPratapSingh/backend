import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
const registerUser = asyncHandler(async (req, res) => {
    // console.log("Handler invoked");
    // res.status(200).json({
    //   message: "user register successfully",
    // });
    //  get user detail from frontend
    // validation - not empty
    // check if user is exist or not: by username or email
    // check for img ,avatar
    // upload them to cloudinary,avatar
    // create user object-create entry in db
    // remove password and refresh token field from responce
    // check for user creation
    // return response
    const {fullName,email,username,password}=req.body;
    console.log(fullName,email,username,password);
    if(!fullName || !email || !password || !username){
        throw new ApiError(400,"all fields are required")
    }
    const existeduser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existeduser)throw new ApiError(409,"user already exist");
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    console.log(req.files);
    
    if(!avatarLocalPath) throw new ApiError(400,"avatar file is required");

   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar)throw new ApiError(400,"avatar is required");
   
   const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   });
   const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser)throw new ApiError(500,"something went wrong while registring user")

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registerd successfully")
  )
  });
export {registerUser};