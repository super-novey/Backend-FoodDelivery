const express = require("express");
const router = express.Router();

const {
  createPartner,
  delelePartner,
  getPartnerById
} = require("../controllers/PartnerController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");
router.get("/:id", getPartnerById);
router.post("/", createPartner);
router.delete("/:id", delelePartner);
// router.put("/:id", updateDateDriver);

module.exports = router;
