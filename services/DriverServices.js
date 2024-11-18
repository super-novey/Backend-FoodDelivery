const UpdatedDriver = require("../models/UpdatedDriver");

const createDriver = async (
  userId,
  licensePlate,
  licenseFrontUrl,
  licenseBackUrl,
  profileUrl
) => {
  return await UpdatedDriver.create({
    userId: userId,
    profileUrl: profileUrl,
    licensePlate,
    licenseFrontUrl: licenseFrontUrl,
    licenseBackUrl: licenseBackUrl,
  });
};

module.exports = { createDriver };
