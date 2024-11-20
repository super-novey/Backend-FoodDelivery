const express = require("express");
const router = express.Router();

const {
  createDriver,
  deleteDriver,
  updateDateDriver,
  getDriverById
} = require("../controllers/DriverController");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");
router.get("/:id", getDriverById);
router.post("/", createDriver);
router.delete("/:id", deleteDriver);
router.put("/:id", updateDateDriver);

module.exports = router;
