const AsyncHandler = require("express-async-handler");
const OrderService = require("../services/OrderServices");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const ApiError = require("./error/ApiError");

// Create a new order
const createOrder = AsyncHandler(async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = await OrderService.createOrder(orderData);

    res.status(StatusCodes.CREATED).json(
      ApiResponse("Order created successfully", newOrder, StatusCodes.CREATED)
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ApiResponse("Failed to create order", null, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// Update an existing order
const updateOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const orderUpdates = req.body;

  try {
    const updatedOrder = await OrderService.updateOrder(orderId, orderUpdates);

    res.status(StatusCodes.OK).json(
      ApiResponse("Order updated successfully", updatedOrder, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(
      ApiResponse("Order not found or update failed", null, StatusCodes.NOT_FOUND)
    );
  }
});

// Get order details by ID
const getOrderDetails = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderService.getOrderDetails(orderId);

    res.status(StatusCodes.OK).json(
      ApiResponse("Order details retrieved successfully", order, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(
      ApiResponse("Order not found", null, StatusCodes.NOT_FOUND)
    );
  }
});

// Get all orders for a customer
const getOrdersByCustomerId = AsyncHandler(async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await OrderService.getOrdersByCustomerId(customerId);

    res.status(StatusCodes.OK).json(
      ApiResponse("Orders retrieved successfully", orders, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(
      ApiResponse("No orders found for this customer", null, StatusCodes.NOT_FOUND)
    );
  }
});

const getOrdersByStatus = AsyncHandler(async (req, res) => {
  const { status } = req.query; 

  try {
    const orders = await OrderService.getOrdersByStatus(status);

    res.status(StatusCodes.OK).json(
      ApiResponse(`Orders with status "${status}" retrieved successfully`, orders, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(
      ApiResponse("No orders found with the specified status", null, StatusCodes.NOT_FOUND)
    );
  }
});

const getAllOrders = AsyncHandler(async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders(); 
    res.status(StatusCodes.OK).json(
      ApiResponse(`Fetch orders retrieved successfully`, orders, StatusCodes.OK)
    );
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(
      ApiResponse("No orders found.", null, StatusCodes.NOT_FOUND)
    );
  }
});



module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getOrdersByCustomerId,
  getOrdersByStatus, 
  getAllOrders,
};

