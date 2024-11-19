const UpdatedPartner = require("../models/UpdatedPartner");

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


module.exports = { createPartner };
