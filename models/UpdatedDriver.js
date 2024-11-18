const mongoose = require("mongoose");
const { Schema } = mongoose;

const UpdatedDriverSchema = Schema(
  {
    userID: {
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
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("UpdatedDriver", UpdatedDriverSchema);
