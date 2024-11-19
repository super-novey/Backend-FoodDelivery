const mongoose = require("mongoose");
const { Schema } = mongoose;

const UpdatedPartnerSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    avatarUrl: {
      type: String,
    },
    storeFront: {
      type: String,
    },
    CCCDFrontUrl: {
      type: String,
    },
    CCCDBackUrl: {
      type: String,
    },

    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    categoryOrderIdx: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    provinceId: {
      type: String,
    },

    districtId: {
      type: String,
    },

    communeId: {
      type: String,
    },

    detailAddress: {
      type: String,
    },
  },
  {
    timeStamp: true,
  }
);
module.exports = mongoose.model("UpdatedPartner", UpdatedPartnerSchema);
