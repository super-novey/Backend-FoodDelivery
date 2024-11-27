const UpdatedPartner = require("../models/UpdatedPartner");
const mongoose = require('mongoose');
const createPartner = async (
  userId,
  description,
  provinceId,
  districtId,
  communeId,
  detailAddress,
  avatarUrl,
  storeFront,
  CCCDFrontUrl,
  CCCDBackUrl
  
) => {
  return await UpdatedPartner.create({
    userId: userId,
    description: description,
    categoryOrderIdx: [],
    provinceId: provinceId,
    districtId: districtId,
    communeId: communeId,
    detailAddress: detailAddress,
    avatarUrl: avatarUrl,
    storeFront: storeFront,
    CCCDFrontUrl: CCCDFrontUrl,
    CCCDBackUrl: CCCDBackUrl
  });
};

const getPartnerByUserID = async (userId) => {
  try {
    const partner = await UpdatedPartner.findOne({ userId })
      .populate({
        path: "userId", // Reference to User model
        model: "User", // Ensure the correct model is used for population
      })
      .exec();

    if (!partner) {
      throw new Error("Partner not found for the given userId");
    }
    return partner;
  } catch (error) {
    console.error("Error fetching partner and user:", error);
    throw error;
  }
};
const getDetailPartnerByPartnerId = async (id) => {
  try {
    const objectId = new mongoose.Types.ObjectId(id.trim());

    const partner = await UpdatedPartner.findById(objectId)
      .populate('userId', 'name phone') 
      .exec();

    if (!partner) {
      throw new Error('Không tìm thấy partner với ID cung cấp');
    }

    partner.categoryOrderIdx = undefined;

    return partner;
  } catch (error) {
    throw new Error(`Lỗi khi lấy partner: ${error.message}`);
  }
};



module.exports = { createPartner, getPartnerByUserID, getDetailPartnerByPartnerId };
