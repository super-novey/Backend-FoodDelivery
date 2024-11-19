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

module.exports = { createDriver, getDriverWithUserDetails };
