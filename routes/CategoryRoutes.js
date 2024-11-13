const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategoriesByPartnerId,
} = require("../controllers/CategoryController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

router.post("/", addCategory);
router.get("/:partnerId", getCategoriesByPartnerId);
// router.delete("/:id", delelePartner);
// router.put("/:id", updateDateDriver);

module.exports = router;
