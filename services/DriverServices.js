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

const getDriverByUserID = async (userId) => {
  try {
    const driver = await UpdatedDriver.findOne({ userId })
      .populate({
        path: "userId", 
        model: "User", 
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

const updateDriverStatus = async (driverId, status) => {
  try {
    const updatedDriver = await UpdatedDriver.findOneAndUpdate(
      { _id: driverId }, 
      { status },  
      { new: true }
    );

    if (!updatedDriver) {
      throw new Error("Driver not found.");
    }

    return updatedDriver; 
  } catch (error) {
    console.error("Error updating driver status:", error);
    throw error; 
  }
};

module.exports = { createDriver, getDriverByUserID, updateDriverStatus };
