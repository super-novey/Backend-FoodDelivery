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
    const items = await Item.find({
      categoryId: categoryId,
      isDeleted: isDeleted,
    });

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
const getItemsByCategoryIdInCustomer = async (
  categoryId,
  isDeleted,
  status
) => {
  try {
    const items = await Item.find({
      categoryId: categoryId,
      isDeleted: isDeleted,
      status: status,
    });

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
  quantity,
  keySearch
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
    keySearch,
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
  quantity,
  keySearch
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
        keySearch,
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

const deleteItem = async (id) => {
  try {
    const deletedItem = await Item.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
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
const searchItemsByName = async (query, status, isDeleted) => {
  try {
    const normalizedQuery = removeVietnameseTones(query);

    const items = await Item.find({
      normalizedItemName: { $regex: normalizedQuery, $options: "i" },
      status,
      isDeleted
    });

    return items;
  } catch (error) {
    console.error("Error searching items by name:", error.message);
    throw new Error(error);
  }
};

const getItemByCategory = async (keySearch, status) => {
  try {
    if (typeof keySearch !== "string") {
      keySearch = String(keySearch);
    }
    console.log("keySearch:", keySearch);

    const items = await Item.find({
      keySearch: { $regex: keySearch, $options: "i" },
      status,
    });

    if (!items || items.length === 0) {
      console.log("No items found with the keySearch:", keySearch);
      return [];
    }

    return items;
  } catch (error) {
    console.error("Error retrieving items by keySearch:", error.message);
    throw error;
  }
};

const updateQuantity = async (itemId, newSales) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { sales },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error updating sales item: ", error.message);
    throw error;
  }
};
const getTopItems = async () => {
  try {
    const topItems = await Item.aggregate([
      {
        $match: {
          isDeleted: "false", 
          status: true,
        },
      },
      {
        $sort: { sales: -1 }, 
      },
      {
        $limit: 10, 
      },
      {
        $project: {
          itemName: 1,
          price: 1,
          sales: 1,
          itemImage: 1,
          description: 1,
          partnerId: 1
        },
      },
    ]);

    return topItems;
  } catch (error) {
    throw new Error(`Error fetching top items: ${error.message}`);
  }
};
module.exports = {
  getItemsByCategoryId,
  createNewItem,
  getItemById,
  deleteItem,
  updateItem,
  searchItemsByName,
  getItemsByCategoryIdInCustomer,
  getItemByCategory,
  getTopItems
};
