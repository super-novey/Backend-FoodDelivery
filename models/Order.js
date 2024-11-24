const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "Customer", 
    required: true,
  },

  driver_status: {
    type: String, 
    default: null, 
  },

  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Partner", 
    default: null, 
  },

  assigned_shipper_id: {
    type: Schema.Types.ObjectId,
    ref: "Driver", 
    default: null, 
  },

  cust_shipper_rating: {
    type: Number, 
    min: 1,
    max: 5,
    default: null, 
  },

  delivery_fee: {
    type: Number,
    required: true, 
  },

  order_datetime: {
    type: Date,
    default: Date.now, 
  },

  note: {
    type: String, 
    default: "",
  },

  cust_res_rating: {
    type: Number, 
    min: 1,
    max: 5,
    default: null, 
  },

  reason: {
    type: String, 
    default: "",
  },

  cust_status: {
      type: String, 
    default: null, 
  },

  partner_status: {
      type: String, 
    default: null, 
      
  },
});


module.exports = mongoose.model("Order", OrderSchema);
