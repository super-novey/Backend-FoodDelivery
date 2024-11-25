const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");
const ItemServices = require("../services/ItemServices");
const Category = require("../models/Category");
const Partner = require("../models/UpdatedPartner");
const Item = require("../models/Item");

const addItemToCategory = AsyncHandler(async (req, res) => {
  const { categoryId, itemName, price, description, status, partnerId } =
    req.body;

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

  if (req.files) {
    itemImage = req.files.itemImage[0].path;
  }

  const newItem = await ItemServices.createNewItem(
    categoryId,
    itemName,
    price,
    description,
    status,
    itemImage,
    partnerId
  );

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse("Item created successfully.", newItem, StatusCodes.CREATED)
    );
});

const updateItemInCategory = AsyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { categoryId, itemName, price, description, status } =
    req.body;

  const item = await Item.findById(itemId);
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
  if (req.files && req.files.itemImage) {
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
    const items = await ItemServices.getItemsByCategoryId(categoryId);

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

module.exports = {
  addItemToCategory,
  getItemById,
  getItemsByCategory,
  deleteItem,
  updateItemInCategory,
};
