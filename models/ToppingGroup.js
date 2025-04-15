const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "ToppingGroup"
const COLLECTION_NAME = 'ToppingGroups'

const toppingGroupScheme = new Schema({
   tpGroupName: {type: String, required: true},  // "Size", "Trân châu"
   tpGroup_toppings: {type: Array,  default: []}
   /*
   [
     {
      "images": [],
      "name": "Size M ",
      "price": 10
      },
      {
      "images": [],
      "name": "Size L",
      "price": 20
      } 
  ]
   */
},
 {
    collection: COLLECTION_NAME,
 })

 module.exports = model(DOCUMENT_NAME, toppingGroupScheme);
