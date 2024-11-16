const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean, //true: Avaiable, false: Unavailable
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "partner", "driver", "customer"],
      default: ["customer"],
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
