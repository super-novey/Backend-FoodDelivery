const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");

// reset password via sending OTP by email

// statictics user

// get user by type

const loadListUser = AsyncHandler(async (req, res) => {
    try {
      const users = await User.find();
  
      if (!users || users.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(ApiResponse("No users found", null, StatusCodes.NOT_FOUND));
      }
  
      res
        .status(StatusCodes.OK)
        .json(ApiResponse("Users retrieved successfully", users, StatusCodes.OK));
    } catch (error) {
      throw new ApiError("Failed to retrieve users", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
  
  module.exports = { loadListUser };