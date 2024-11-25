const ApiError = require("../controllers/error/ApiError");
const Item = require("../models/Item");

const getItemsByCategoryId = async (categoryId) => {
  try {
    const items = await Item.find({ categoryId: categoryId });

    if (items.length === 0) {
      console.log("No items found for this category.");
    } else {
      console.log("Items:", items);
    }

    return items;
  } catch (error) {
    console.error("Error retrieving items by category ID:", error.message);
    throw error;
  }
};

const createNewItem = async (
  categoryId,
  itemName,
  price,
  description,
  status,
  itemImage,
  partnerId
) => {
  return await Item.create({
    categoryId: categoryId,
    itemName: itemName,
    price: price,
    description: description,
    status: status,
    itemImage: itemImage,
    partnerId: partnerId,
  });
};

const deleteItem = async (id) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return null;
    }
    return deletedItem;
  } catch (e) {
    throw new Error(e);
  }
};

const getItemById = async (itemId) => {
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      console.log("Item not found.");
      return null;
    }

    console.log("Item:", item);
    return item;
  } catch (error) {
    console.error("Error retrieving item by ID:", error.message);
    throw error;
  }
};

module.exports = {
  getItemsByCategoryId,
  createNewItem,
  getItemById,
  deleteItem,
};
