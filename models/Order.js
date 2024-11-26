const mongoose = require("mongoose");
const { Schema } = mongoose;
const { OrderItemSchema } = require("./OrderItem.js"); 

const OrderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  driverStatus: {
    type: String,
    default: null,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Partner",
    default: null,
  },
  assignedShipperId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
  custShipperRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
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
  reason: {
    type: String,
    default: "",
  },
  custStatus: {
    type: String,
    enum: ["new", "accepted", "processing", "delivered", "cancelled"],
    default: "new",
  },
  partnerStatus: {
    type: String,
    default: null,
  },
  orderItems: [OrderItemSchema], 
});

module.exports = mongoose.model("Order", OrderSchema);
