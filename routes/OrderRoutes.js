const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

// Route for creating a new order
router.post("/", OrderController.createOrder);

// Route for updating an existing order by ID
router.put("/:orderId", OrderController.updateOrder);

// Route for getting order details by ID
router.get("/:orderId", OrderController.getOrderDetails);

// Route for getting all orders by a customer ID
router.get("/customer/:customerId", OrderController.getOrdersByCustomerId);

module.exports = router;
