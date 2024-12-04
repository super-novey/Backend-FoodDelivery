const dotenv = require("dotenv");
dotenv.config();
const AsyncHandler = require("express-async-handler");

const User = require("../models/User");
const UpdatedPartner = require("../models/UpdatedPartner");
const ApiError = require("./error/ApiError");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const {
  returnMultipleFilePath,
  multipleFilesTransfer,
  removeFile,
} = require("../helpers/fileHelpers");
const Partner = require("../models/Partner");
const { getPartnerByUserID, getDetailPartnerByPartnerId, updatePartnerStatus } = require("../services/PartnerServices");

const createPartner = AsyncHandler(async (req, res) => {
  const { userId, description } = req.body;

  // is user exists
  const user = await User.findById(userId);

  if (!user || user.role !== "partner") {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Partner is not found", null, StatusCodes.NOT_FOUND));
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

  const newPartner = await Partner.create({
    userId: userId,
    photos: [
      { name: "avatar", url: newImagePaths[0] || "" },
      { name: "storefont", url: newImagePaths[1] || "" },
      { name: "CCCD_front", url: newImagePaths[2] || "" },
      { name: "CCCD_back", url: newImagePaths[3] || "" },
    ],
    description: description,
    categoryOrderIdx: [],
  });
  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "Partner created successfully.",
        { newPartner },
        StatusCodes.CREATED
      )
    );
});

const delelePartner = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  //is driver exists
  const partner = await Partner.findByIdAndDelete(id);
  if (!partner) {
    // If not found, throw error
    throw new ApiError("Partner is not found");
  }
  // remove profile images
  partner.photos.map((item) => {
    removeFile(item.url);
    console.log(item.url);
  });
  // return res
  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Partner deleted successfully.", StatusCodes.OK));
});

const updateStatus = AsyncHandler(async (req, res) => {
  const { userId } = req.params; 
  const { status } = req.body;   
  if (typeof status !== 'boolean') {
    return res.status(StatusCodes.BAD_REQUEST).json(
      ApiResponse("Status must be a boolean.", null, StatusCodes.BAD_REQUEST)
    );
  }
  try {
    const updatedPartner = await updatePartnerStatus(userId, status);
    res.status(StatusCodes.OK).json(
      ApiResponse("Partner status updated successfully.", updatedPartner, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ApiResponse("Error updating partner status.", null, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params; 
    const driver = await UpdatedPartner.findOne({ userId: id }).populate("userId");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Partner not found with provided userId",
      });
    }

    res.status(200).json({
      success: true,
      message: "Partner fetched successfully",
      data: driver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Partner error occurred",
    });
  }
};

const getPartnerByUserId = AsyncHandler(async (req, res) => {
  const { userId } = req.params;

  const driver = await getPartnerByUserID(userId);

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Successfully.", driver, StatusCodes.OK));
});
const getPartnerByPartnerId = async (req, res) => {
  try {
    const { id } = req.params; 

    const partner = await getDetailPartnerByPartnerId(id);
    

    res.status(200).json({
      success: true,
      message: 'Partner fetched successfully',
      data: partner, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Partner error occurred',
    });
  }
};
module.exports = { createPartner, delelePartner, getPartnerByUserId, getPartnerById, getPartnerByPartnerId, updateStatus };
