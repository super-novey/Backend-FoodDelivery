const AsyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Partner = require("../models/Partner");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const mongoose = require("mongoose");

const addCategory = AsyncHandler(async (req, res) => {
  const { partnerId, name } = req.body;

  const partner = await Partner.findById(partnerId);

  if (!partner) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Partner is not found", null, StatusCodes.NOT_FOUND));
  }

  const existingCategory = await Category.findOne({
    partnerId: partnerId,
    name,
  });

  if (existingCategory) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Category name already exists." });
  }

  const newCategory = await Category.create({
    partnerId: partnerId,
    name: name,
  });

  if (!newCategory) {
    throw new ApiError(
      "Internal Server Error! Server failed creating new category."
    );
  }

  partner.categoryOrderIdx.push(newCategory._id);
  await partner.save();

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "Category created successfully.",
        { newCategory },
        StatusCodes.CREATED
      )
    );
});

const getCategoriesByPartnerId = AsyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  // Perform aggregation to retrieve the partner with categories ordered by categoryId
  const partner = await Partner.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(partnerId) },
    },
    {
      $unwind: "$categoryOrderIdx",
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryOrderIdx",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $sort: {
        "categoryOrderIdx.orderIndex": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        categories: { $push: "$categoryDetails" },
      },
    },
  ]);

  // If no partner is found
  if (!partner || partner.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Partner not found", null, StatusCodes.NOT_FOUND));
  }

  // Return the ordered categories
  res
    .status(StatusCodes.OK)
    .json(
      ApiResponse(
        "Categories retrieved successfully.",
        partner[0].categories,
        StatusCodes.OK
      )
    );
});

module.exports = { addCategory, getCategoriesByPartnerId };
