import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("Handler invoked");
    res.status(200).json({
      message: "user register successfully",
    });
  });
export {registerUser};