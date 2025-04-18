const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = "ToppingGroup"
const COLLECTION_NAME = 'ToppingGroups'

const toppingGroupSchema = new Schema({
   tpGroupName: {type: String, required: true},  // "Size", "Trân châu"
   tpShopId: {type: Types.ObjectId, ref: "UpdatedPartner"},
   orderIndex: {type: Number, default: 0}
},
 {
    collection: COLLECTION_NAME,
 })

 module.exports = model(DOCUMENT_NAME, toppingGroupSchema);
