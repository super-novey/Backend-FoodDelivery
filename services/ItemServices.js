const ApiError = require("../controllers/error/ApiError");
const Item = require("../models/Item");
const User = require("../models/User");
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

const addToFavorites = async (userId, itemId) => {
  try {
    console.log(`Thêm món ăn yêu thích | userId: ${userId}, itemId: ${itemId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log("Người dùng không tồn tại:", userId);
      throw new ApiError("Người dùng không tồn tại", 404);
    }

    const item = await Item.findById(itemId);
    if (!item) {
      console.log("Món ăn không tồn tại:", itemId);
      throw new ApiError("Món ăn không tồn tại", 404);
    }

    if (user.favoriteList.includes(itemId.toString())) {
      console.log("Món ăn đã có trong danh sách yêu thích:", itemId);
      throw new ApiError("Món ăn đã có trong danh sách yêu thích", 400);
    }

    user.favoriteList.push(itemId);
    await user.save();
    
    console.log("Món ăn đã được thêm vào danh sách yêu thích!");
    return user;
  } catch (error) {
    console.error("Lỗi khi thêm vào danh sách yêu thích:", error.message);
    throw error;
  }
};
const removeFromFavorites = async (userId, itemId) => {
  try {
    console.log(`Xóa món ăn khỏi yêu thích | userId: ${userId}, itemId: ${itemId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log("Người dùng không tồn tại:", userId);
      throw new ApiError("Người dùng không tồn tại", 404);
    }

    const favoriteListBefore = user.favoriteList.length;
    user.favoriteList = user.favoriteList.filter(id => id.toString() !== itemId);

    if (user.favoriteList.length === favoriteListBefore) {
      console.log("Món ăn không có trong danh sách yêu thích:", itemId);
      throw new ApiError("Món ăn không có trong danh sách yêu thích", 400);
    }

    await user.save();
    console.log("Món ăn đã được xóa khỏi danh sách yêu thích!");
    
    return user;
  } catch (error) {
    console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error.message);
    throw error;
  }
};

const getFavorite = async (userId) => {
  try {
    console.log("Fetching favorite list for user:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return [];
    }

    if (!user.favoriteList || user.favoriteList.length === 0) {
      console.log("No favorite items found for user:", userId);
      return [];
    }

    const favoriteItems = await Item.find({
      _id: { $in: user.favoriteList },
    }).select("_id partnerId itemName price description itemImage sales");

    return favoriteItems;
  } catch (error) {
    console.error("Error retrieving favorite items:", error.message);
    throw error;
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
  getTopItems,
  addToFavorites,
  removeFromFavorites,
  getFavorite
};
