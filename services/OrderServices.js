const Order = require("../models/Order");
const mongoose = require('mongoose');
const { StatusCodes } = require("http-status-codes");

const createOrder = async (orderData) => {
  try {
    const newOrder = await Order.create(orderData);

    if (!newOrder) {
      throw new Error("Failed to create order");
    }

    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
};

const updateOrder = async (orderId, orderUpdates) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, orderUpdates, { new: true });

    if (!updatedOrder) {
      throw new Error("Order not found or update failed");
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error.message);
    throw error;
  }
};



const getOrderDetails = async (orderId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const order = await Order.findById(orderId)
      .populate('customer_id restaurant_id assigned_shipper_id');

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    throw error;
  }
};


const getOrdersByCustomerId = async (customerId) => {
  try {
    const orders = await Order.find({ customer_id: customerId }).populate('restaurant_id assigned_shipper_id');

    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this customer");
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders by customer:", error.message);
    throw error;
  }
};

const getOrdersByStatus = async (status) => {
  try {
    const orders = await Order.find({ status })
      .populate({ path: "customerId", select: "name" })
      .populate({
        path: "restaurantId",
        populate: { path: "userId", select: "name detailAddress" },
      });

    if (!orders || orders.length === 0) {
      throw new Error("No orders found with the specified status");
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders by status:", error.message);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    throw error;
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getOrdersByCustomerId,
  getOrdersByStatus,
  getAllOrders, 
};


