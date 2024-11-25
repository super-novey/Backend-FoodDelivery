const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");
const ItemServices = require("../services/ItemServices");
const Category = require("../models/Category");
const Partner = require("../models/UpdatedPartner");

const addItemToCategory = AsyncHandler(async (req, res) => {
  const { categoryId, itemName, price, description, status, partnerId } =
    req.body;

  const category = await Category.findById(categoryId);
  const partner = await Partner.findById(partnerId);

  if (!category || !partner) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Category or Partner is not found", null, StatusCodes.NOT_FOUND));
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
};
