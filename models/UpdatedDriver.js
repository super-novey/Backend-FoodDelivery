const mongoose = require("mongoose");
const { Schema } = mongoose;

const UpdatedDriverSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profileUrl: {
      type: String,
    },

    licensePlate: {
      type: String,
    },

    licenseFrontUrl: {
      type: String,
    },

    licenseBackUrl: {
      type: String,
    },

    status: {
      type: Boolean,
      default: false,
    },

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

module.exports = mongoose.model("UpdatedDriver", UpdatedDriverSchema);
