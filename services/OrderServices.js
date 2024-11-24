const Order = require("../models/Order");
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
    const order = await Order.findById(orderId).populate('customer_id restaurant_id assigned_shipper_id');

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

module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getOrdersByCustomerId
};
