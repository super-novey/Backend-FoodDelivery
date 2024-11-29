const ApiError = require("../controllers/error/ApiError");
const Item = require("../models/Item");
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
const getItemsByCategoryId = async (categoryId, isDeleted) => {
  try {
    const items = await Item.find({ categoryId: categoryId, isDeleted: isDeleted });

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
  partnerId,
  normalizedItemName,
  quantity
) => {
  return await Item.create({
    categoryId,
    itemName,
    price,
    description,
    status,
    itemImage,
    partnerId,
    normalizedItemName, // Lưu tên không dấu
    quantity,
  });
};

const updateItem = async (
  itemId,
  categoryId,
  itemName,
  price,
  description,
  status,
  itemImage,
  normalizedItemName,
  quantity
) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        categoryId,
        itemName,
        price,
        description,
        status,
        itemImage,
        normalizedItemName, // Cập nhật tên không dấu
        quantity,
      },
      { new: true }
    );

    if (!updatedItem) {
      throw new Error("Item not found or update failed");
    }

    return updatedItem;
  } catch (error) {
    console.error("Error updating item:", error.message);
    throw error;
  }
};

// const deleteItem = async (id) => {
//   try {
//     const deletedItem = await Item.findByIdAndDelete(id);
//     if (!deletedItem) {
//       return null;
//     }
//     return deletedItem;
//   } catch (e) {
//     throw new Error(e);
//   }
// };

const deleteItem = async (id) => {
  try {
    const deletedItem = await Item.findByIdAndUpdate(id, { isDeleted: true}, { new: true });
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
const searchItemsByName = async (query) => {
  try {
    const normalizedQuery = removeVietnameseTones(query);

    const items = await Item.find({
      normalizedItemName: { $regex: normalizedQuery, $options: "i" },
    });

    return items;
  } catch (error) {
    console.error("Error searching items by name:", error.message);
    throw new Error(error);
  }
};

module.exports = {
  getItemsByCategoryId,
  createNewItem,
  getItemById,
  deleteItem,
  updateItem,
  searchItemsByName,
};
