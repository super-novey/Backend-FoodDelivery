const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },

  itemName: {
    type: String,
  },

  price: {
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
});

module.exports = mongoose.model("Item", ItemSchema);
