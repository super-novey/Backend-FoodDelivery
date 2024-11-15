const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategoriesByPartnerId,
  deleteCategory,
} = require("../controllers/CategoryController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

router.post("/", addCategory);
router.get("/:partnerId", getCategoriesByPartnerId);
router.delete("/:id", deleteCategory);
// router.put("/:id", updateDateDriver);

module.exports = router;
