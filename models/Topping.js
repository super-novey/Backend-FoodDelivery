const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = "Topping"
const COLLECTION_NAME = 'Toppings'

const toppingSchema = new Schema({
    tpName: { type: String, required: true },
    tpPrice: { type: Number, default: 0 },
    tpImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    tpGroupId: { type: Types.ObjectId, ref: "ToppingGroup" },
},
    {
        collection: COLLECTION_NAME,
    })

module.exports = model(DOCUMENT_NAME, toppingSchema);
