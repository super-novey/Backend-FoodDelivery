const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");
const userService = require("../services/UserServices");

const loadListUser = AsyncHandler(async (req, res) => {
  try {
    const users = await userService.findUsersByStatus(true, false);

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
    const users = await userService.findUsersByRoleAndStatus(role, false);

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

    const updatedUser = await userService.approveUserById(userId);

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

const updateUser = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse("User ID is required", null, StatusCodes.BAD_REQUEST));
    }

    const updatedUser = await userService.updateUserById(userId, updateData);

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("User not found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("User updated successfully", updatedUser, StatusCodes.OK));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new ApiError("Failed to update user", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
const deleteUser = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse("User ID is required", null, StatusCodes.BAD_REQUEST));
    }

    const updatedUser = await userService.deleteUser(userId);

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("User not found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("User delete successfully", updatedUser, StatusCodes.OK));
  } catch (error) {
    throw new ApiError("Failed to delete user", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = {
  loadListUser,
  loadListUserByRoleAndStatus,
  approveUser,
  updateUser,
  deleteUser
};
