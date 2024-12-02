const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");
const ItemServices = require("../services/ItemServices");
const Category = require("../models/Category");
const Partner = require("../models/UpdatedPartner");
const Item = require("../models/Item");
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
const addItemToCategory = AsyncHandler(async (req, res) => {
  const {
    categoryId,
    itemName,
    price,
    description,
    status,
    partnerId,
    quantity,
    keySearch,
  } = req.body;

  const category = await Category.findById(categoryId);
  const partner = await Partner.findById(partnerId);

  if (!category || !partner) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "Category or Partner is not found",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }

  let itemImage = "";

  if (req.files && req.files.itemImage && req.files.itemImage.length > 0) {
    itemImage = req.files.itemImage[0].path;
  }

  const newItem = await ItemServices.createNewItem(
    categoryId,
    itemName,
    price,
    description,
    status,
    itemImage,
    partnerId,
    removeVietnameseTones(itemName),
    quantity,
    keySearch
  );

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse("Item created successfully.", newItem, StatusCodes.CREATED)
    );
});

const updateItemInCategory = AsyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const {
    categoryId,
    itemName,
    price,
    description,
    status,
    quantity,
    keySearch,
  } = req.body;

  const item = await ItemServices.getItemById(itemId);
  const category = categoryId ? await Category.findById(categoryId) : null;

  if (!item) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Item not found", null, StatusCodes.NOT_FOUND));
  }

  if (categoryId && !category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Category not found", null, StatusCodes.NOT_FOUND));
  }

  let itemImage = item.itemImage;
  if (req.files && req.files.itemImage && req.files.itemImage.length > 0) {
    itemImage = req.files.itemImage[0].path;
  }

  try {
    const updatedItem = await ItemServices.updateItem(
      itemId,
      categoryId || item.categoryId,
      itemName || item.itemName,
      price || item.price,
      description || item.description,
      status !== undefined ? status : item.status,
      itemImage,
      itemName ? removeVietnameseTones(itemName) : item.normalizedItemName, // Cập nhật tên không dấu
      quantity || item.quantity,
      keySearch || keySearch
    );

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Item updated successfully.", updatedItem, StatusCodes.OK)
      );
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse(
          "Failed to update item.",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
  }
});

const deleteItem = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await ItemServices.deleteItem(id);
    if (!deletedItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("Item not found", null, StatusCodes.NOT_FOUND));
    }
    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Item deleted successfully", deleteItem, StatusCodes.OK)
      );
  } catch (e) {
    throw new ApiError(e);
  }
});

const getItemById = AsyncHandler(async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await ItemServices.getItemById(itemId);

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("Item not found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(ApiResponse("Item retrieved successfully", item, StatusCodes.OK));
  } catch (error) {
    console.error("Error retrieving item by ID:", error.message);
    throw new Error("Failed to retrieve item.");
  }
});

const getItemsByCategory = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Fetch items by category ID
    const items = await ItemServices.getItemsByCategoryId(categoryId, false);

    if (items.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          ApiResponse(
            "No items found for this category.",
            [],
            StatusCodes.NOT_FOUND
          )
        );
    }

    // Respond with the list of items
    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Items retrieved successfully.", items, StatusCodes.OK)
      );
  } catch (error) {
    console.error("Error retrieving items by category ID:", error.message);
    throw new Error("Failed to retrieve items.");
  }
});
const searchItemsByName = AsyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ApiResponse(
          "Query parameter is required",
          null,
          StatusCodes.BAD_REQUEST
        )
      );
  }

  try {
    const normalizedQuery = removeVietnameseTones(query);

    const items = await Item.find({
      status: true,
      $or: [
        { itemName: { $regex: query, $options: "i" } },
        { normalizedItemName: { $regex: normalizedQuery, $options: "i" } },
      ],
    });

    if (items.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          ApiResponse("No items match your search.", [], StatusCodes.NOT_FOUND)
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          "Search results retrieved successfully.",
          items,
          StatusCodes.OK
        )
      );
  } catch (error) {
    console.error("Error searching items:", error.message);
    throw new ApiError("Failed to retrieve search results.");
  }
});
const getItemsByCategoryInCustomer = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Fetch items by category ID
    const items = await ItemServices.getItemsByCategoryIdInCustomer(
      categoryId,
      false,
      true
    );

    if (items.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          ApiResponse(
            "No items found for this category.",
            [],
            StatusCodes.NOT_FOUND
          )
        );
    }

    // Respond with the list of items
    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Items retrieved successfully.", items, StatusCodes.OK)
      );
  } catch (error) {
    console.error("Error retrieving items by category ID:", error.message);
    throw new Error("Failed to retrieve items.");
  }
});
const getItemByCategoryInHome = AsyncHandler(async (req, res) => {
  const { keySearch } = req.query; 

  if (!keySearch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "keySearch parameter is required.",
    });
  }

  try {
    const items = await ItemServices.getItemByCategory(keySearch, true);

    if (items.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(
        ApiResponse(
          "No items found with the provided keySearch.",
          [],
          StatusCodes.NOT_FOUND
        )
      );
    }

    return res.status(StatusCodes.OK).json(
      ApiResponse("Items retrieved successfully.", items, StatusCodes.OK)
    );
  } catch (error) {
    console.error("Error retrieving items:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve items.",
    });
  }
});


module.exports = {
  addItemToCategory,
  getItemById,
  getItemsByCategory,
  deleteItem,
  updateItemInCategory,
  searchItemsByName,
  getItemsByCategoryInCustomer,
  getItemByCategoryInHome
};
