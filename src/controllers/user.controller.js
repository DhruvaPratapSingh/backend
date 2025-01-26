import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const refreshToken=user.generateRefreshToken();
        const accessToken=user.generateAccessToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong to generating refresh and aceess token")
    }
}

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
  const loginUser=asyncHandler(async(req,res)=>{
    // take data from reqbody
    // username or email
    // find user
    // password check
    // access token and refresh token
    // send token by cookies
    const {username,email,password}=req.body;
    console.log(username,email,password);
    if(!(username || email))throw new ApiError(400,"username or email  is required");
   const user=await User.findOne({
        $or:[{username},{email}]
    })
    // console.log(user);
    if(!user)throw new ApiError(404,"user is not registered");
    console.log(user.isPasswordCorrect(password));
    const isPasswordValid= await user.isPasswordCorrect(password);
    console.log(isPasswordValid);
    if(!isPasswordValid)throw new ApiError(401,"password is incorrect")
    const {refreshToken,accessToken}= await generateAccessAndRefreshTokens(user._id);
    const loggedInUser=await User.findById(user._id)
    .select("-password -refreshToken");
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user:loggedInUser,accessToken,refreshToken
            },
            "user loggedIn successfully"
        )
    )
  })

  const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
       { 
        new:true
    }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user loggedout successfully"))
  })
export {registerUser,loginUser,logoutUser};