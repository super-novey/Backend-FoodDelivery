const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: "UpdatedPartner",
  },

  itemName: {
    type: String,
  },

  price: {
    type: Number,
  },

  keySearch: {
    type: String,
  },

  quantity: {
    type: Number,
  },

  sales: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
  },

  status: {
    type: Boolean,
    default: false,
  },

  itemImage: {
    type: String,
  },

  isDeleted: {
    type: String,
    default: false,
  },

  normalizedItemName: {
    type: String,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
