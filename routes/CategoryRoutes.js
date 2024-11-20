const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategoriesByPartnerId,
  deleteCategory,
  deleteAllCategoriesOfPartner,
  updateCategory,
} = require("../controllers/CategoryController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

router.post("/", addCategory);
router.get("/:partnerId", getCategoriesByPartnerId);
// router.delete("/:id", deleteAllCategoriesOfPartner);
router.delete("/:id", deleteCategory);
router.delete("/deleteAll/:partnerId", deleteAllCategoriesOfPartner);
router.put("/:categoryId", updateCategory);

module.exports = router;
