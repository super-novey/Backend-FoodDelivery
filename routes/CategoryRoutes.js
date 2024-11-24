const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategoriesByPartnerId,
  deleteCategory,
  deleteAllCategoriesOfPartner,
  updateCategory,
  reorderCategoryIndex,
} = require("../controllers/CategoryController");

router.post("/", addCategory);
router.post("/reorder", reorderCategoryIndex);
router.get("/:partnerId", getCategoriesByPartnerId);
// router.delete("/:id", deleteAllCategoriesOfPartner);
router.delete("/:id", deleteCategory);
router.delete("/deleteAll/:partnerId", deleteAllCategoriesOfPartner);
router.put("/:categoryId", updateCategory);

module.exports = router;
