const express = require("express");
const router = express.Router();

const {
  createDriver,
  deleteDriver,
  updateDateDriver,
} = require("../controllers/DriverController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

router.post("/", createDriver);
router.delete("/:id", deleteDriver);
router.put("/:id", updateDateDriver);

module.exports = router;
