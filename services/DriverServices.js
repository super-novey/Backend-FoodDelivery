const UpdatedDriver = require("../models/UpdatedDriver");

const createDriver = async (
  userId,
  licensePlate,
  licenseFrontUrl,
  licenseBackUrl,
  profileUrl,
  provinceId,
  districtId,
  communeId,
  detailAddress
) => {
  return await UpdatedDriver.create({
    userId: userId,
    profileUrl: profileUrl,
    licensePlate,
    licenseFrontUrl: licenseFrontUrl,
    licenseBackUrl: licenseBackUrl,
    provinceId: provinceId,
    districtId: districtId,
    communeId: communeId,
    detailAddress: detailAddress,
  });
};

const getDriverWithUserDetails = async (driverId) => {
  try {
    const driver = await UpdatedDriver.findById(driverId).populate("userId");
    if (!driver) {
      return null;
    }

    return driver;
  } catch (error) {
    throw new Error(
      "Error fetching driver with user details: " + error.message
    );
  }
};

const getDriverByUserID = async (userId) => {
  try {
    const driver = await UpdatedDriver.findOne({ userId })
      .populate({
        path: "userId", // Reference to User model
        model: "User", // Ensure the correct model is used for population
      })
      .exec();

    if (!driver) {
      throw new Error("Driver not found for the given userId");
    }
    return driver;
  } catch (error) {
    console.error("Error fetching driver and user:", error);
    throw error;
  }
};

module.exports = { createDriver, getDriverWithUserDetails, getDriverByUserID };
