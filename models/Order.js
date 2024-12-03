const mongoose = require("mongoose");
const { Schema } = mongoose;
const { OrderItemSchema } = require("./OrderItem.js");

const OrderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  custAddress: {
    type: String,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "UpdatedPartner",
    default: null,
  },
  assignedShipperId: {
    type: Schema.Types.ObjectId,
    ref: "UpdatedDriver",
    default: null,
  },
  custShipperRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  custShipperRatingComment: {
    type: String,
    default: "",
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  orderDatetime: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: "",
  },
  custResRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  custResRatingComment: {
    type: String,
    default: "",
  },
  reason: {
    type: String,
    default: "",
  },
  custStatus: {
    type: String,
    enum: [
      "waiting",
      "heading_to_rest",
      "preparing",
      "delivering",
      "delivered",
      "cancelled",
    ],
    default: "waiting",
  },
  driverStatus: {
    type: String,
    enum: [
      "waiting",
      "heading_to_rest",
      "delivering",
      "delivered",
      "cancelled",
    ],
    default: "waiting",
  },
  restStatus: {
    type: String,
    enum: ["new", "preparing", "completed", "cancelled"],
    default: "new",
  },
  orderItems: [OrderItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Order", OrderSchema);
