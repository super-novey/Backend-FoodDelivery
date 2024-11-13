const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = Schema({
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: "Partner",
  },

  name: {
    type: String,
  },

});

module.exports = mongoose.model("Category", CategorySchema);
