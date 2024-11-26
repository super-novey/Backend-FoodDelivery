const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

// Route for creating a new order
router.post("/", OrderController.createOrder);

router.get("/", OrderController.getAllOrders);

// Route for updating an existing order by ID
router.put("/:orderId", OrderController.updateOrder);

// Route for getting order details by ID
router.get("/:orderId", OrderController.getOrderDetails);

router.get("/orders/status", OrderController.getOrdersByStatus);

// Route for getting all orders by a customer ID
router.get("/orders/:customerId", OrderController.getOrdersByCustomerId);

module.exports = router;
