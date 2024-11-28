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

  quantity: {
    type: Number,
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
  normalizedItemName: {
    type: String,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
