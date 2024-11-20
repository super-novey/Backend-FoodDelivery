const dotenv = require("dotenv");
dotenv.config();
const AsyncHandler = require("express-async-handler");
const Driver = require("../models/Driver");
const UpdatedDriver = require("../models/UpdatedDriver");
const User = require("../models/User");
const ApiError = require("./error/ApiError");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const {
  returnMultipleFilePath,
  multipleFilesTransfer,
  removeFile,
} = require("../helpers/fileHelpers");

const { getDriverByUserID } = require("../services/DriverServices");

const createDriver = AsyncHandler(async (req, res) => {
  const { userId, licensePlate } = req.body;

  // is user exists
  const user = await User.findById(userId);

  if (!user || user.role !== "driver") {
    // If user not found
    // throw new ApiError("Driver is not found");
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Driver is not found", null, StatusCodes.NOT_FOUND));
  }

  // An array to store new image paths
  let newImagePaths = [];

  // Check if files are included in the request
  if (req.files && Object.keys(req.files).length > 0) {
    if (req.files.multiple) {
      const imagePaths = await returnMultipleFilePath(req.files);
      if (imagePaths.length) {
        newImagePaths = await multipleFilesTransfer(imagePaths, `${userId}`);
      }
    }
  }

  const newDriver = await Driver.create({
    userId: userId,
    profileUrl: newImagePaths[0] || "",
    CCCD: [
      { type: "front", url: newImagePaths[1] || "" },
      { type: "back", url: newImagePaths[2] || "" },
    ],
    licensePlate: licensePlate,
  });

  if (!newDriver) {
    throw new ApiError(
      "Internal Server Error! Server failed creating new driver."
    );
  }
  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "Driver created successfully.",
        { newDriver },
        StatusCodes.CREATED
      )
    );
});

const deleteDriver = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // is driver exists
  const driver = await Driver.findByIdAndDelete(id);
  if (!driver) {
    // If not found, throw error
    throw new ApiError("Driver is not found");
  }
  // remove profile images
  removeFile(driver.CCCD[0].url);
  removeFile(driver.CCCD[1].url);
  removeFile(driver.profileUrl);

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Driver deleted successfully.", StatusCodes.OK));
});

const updateDateDriver = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, licensePlate } = req.body;

  // is driver exists
  const driver = await Driver.findById(id);
  if (!driver) {
    // If not found, throw error
    throw new ApiError("Driver is not found");
  }

  // An array to store new image paths
  let newImagePaths = [];

  // Check if files are included in the request
  if (req.files && Object.keys(req.files).length > 0) {
    if (req.files.multiple) {
      const imagePaths = await returnMultipleFilePath(req.files);
      if (imagePaths.length) {
        newImagePaths = await multipleFilesTransfer(imagePaths, `${userId}`);
      }
    }
  }
  if (newImagePaths[0]) {
    // remove old profileUrl
    removeFile(driver.profileUrl);
    driver.profileUrl = newImagePaths[0];
  }
  if (newImagePaths[1] || newImagePaths[2]) {
    // remove old CCCD url
    removeFile(driver.CCCD[0].url);
    removeFile(driver.CCCD[1].url);
    driver.CCCD = [
      { type: "front", url: newImagePaths[1] || driver.CCCD[0]?.url },
      { type: "back", url: newImagePaths[2] || driver.CCCD[1]?.url },
    ];
  }
  driver.licensePlate = licensePlate;
  await driver.save();
  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Driver updated successfully.", StatusCodes.OK));
});

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params; 
    const driver = await UpdatedDriver.findOne({ userId: id }).populate("userId");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found with provided userId",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver fetched successfully",
      data: driver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

const getDriverByUserId = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  const driver = await getDriverByUserID(userId);

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Successfully.", driver, StatusCodes.OK));
});
module.exports = {
  createDriver,
  deleteDriver,
  updateDateDriver,
  getDriverByUserId,
   getDriverById
};

