const express = require("express");
const router = express.Router();

const {
  createPartner,
  delelePartner
} = require("../controllers/PartnerController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

router.post("/", createPartner);
router.delete("/:id", delelePartner);
// router.put("/:id", updateDateDriver);

module.exports = router;
