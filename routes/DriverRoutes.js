const express = require("express");
const router = express.Router();

const {
  createDriver,
  deleteDriver,
  updateDateDriver,
  getDriverById,
  updateStatus
} = require("../controllers/DriverController");
const OrderController = require("../controllers/OrderController");

const AuthMiddleWare = require("../middlewares/AuthMiddleWare");
router.get("/:id", getDriverById);
router.post("/", createDriver);
router.delete("/:id", deleteDriver);
router.put("/:id", updateDateDriver);
router.put("/updateStatus/:userId", updateStatus);
router.get("/rating/:assignedShipperId", OrderController.getAllRatingByDriver);
router.get("/statistic/:assignedShipperId", OrderController.getDeliveryByDriver);
module.exports = router;
