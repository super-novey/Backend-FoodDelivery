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
    const users = await User.find({ status: true });

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("No users with status = true found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("Users with status = true retrieved successfully", users, StatusCodes.OK));
  } catch (error) {
    throw new ApiError("Failed to retrieve users", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
const loadListUserByRoleAndStatus = AsyncHandler(async (req, res) => {
  try {
    const { role } = req.query; 
    const query = { status: false };

    if (role && (role === 'driver' || role === 'partner')) {
      query.role = role;  
    } else if (!role) {
      query.role = { $in: ['driver', 'partner'] };
    } else {
      return res.status(StatusCodes.NOT_FOUND).json(ApiResponse("No users found with the specified criteria", null, StatusCodes.NOT_FOUND));
    }

    const users = await User.find(query);

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("No users found with the specified criteria", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("Users retrieved successfully", users, StatusCodes.OK));
  } catch (error) {
    throw new ApiError("Failed to retrieve users", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
const approveUser = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse("User ID is required", null, StatusCodes.BAD_REQUEST));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: true }, 
      { new: true } 
    );

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("User not found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("User approved successfully", updatedUser, StatusCodes.OK));
  } catch (error) {
    throw new ApiError("Failed to approve user", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});


module.exports = { loadListUser, loadListUserByRoleAndStatus, approveUser };
