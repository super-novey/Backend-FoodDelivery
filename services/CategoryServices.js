const Category = require("../models/Category");
const UpdatedPartner = require("../models/UpdatedPartner");
const mongoose = require("mongoose");
const { Types } = require('mongoose')


const deleteAllCategoriesOfPartner = async (partnerId) => {
  try {
    if (!partnerId) {
      throw new Error("Partner ID is required");
    }

    // Delete categories where the partnerId matches
    const result = await Category.deleteMany({ partnerId });

    await UpdatedPartner.updateOne(
      { _id: partnerId },
      { $set: { categoryOrderIdx: [] } }
    );

    if (result.deletedCount === 0) {
      console.log("No categories found for the specified partner.");
    } else {
      console.log(
        `${result.deletedCount} categories deleted for partner ${partnerId}.`
      );
    }

    return result;
  } catch (error) {
    console.error("Error deleting categories:", error.message);
    throw error;
  }
};

const getCategories = async (partnerId) => {
  try {
    const partner = await UpdatedPartner.aggregate([
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

    return partner;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const findById = async (id) => {
  return await Category.findOne({ _id: new Types.ObjectId(id) }).lean()
}



module.exports = { deleteAllCategoriesOfPartner, getCategories, findById };
