const Order = require("../models/Order");
const mongoose = require("mongoose");
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

const updateOrderStatus = async (orderId, statusUpdates) => {
  try {
    const validStatuses = ["custStatus", "driverStatus", "restStatus"];

    const updates = Object.keys(statusUpdates).reduce((acc, key) => {
      if (validStatuses.includes(key)) {
        acc[key] = statusUpdates[key];
      }
      return acc;
    }, {});

    if (statusUpdates.assignedShipperId) {
      updates.assignedShipperId = statusUpdates.assignedShipperId;
    }

    if (statusUpdates.reason) {
      updates.reason = statusUpdates.reason;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No valid statuses provided for update");
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    });

    if (!updatedOrder) {
      throw new Error("Order not found or update failed");
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
};

const updateOrder = async (orderId, orderUpdates) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, orderUpdates, {
      new: true,
    });

    if (!updatedOrder) {
      throw new Error("Order not found or update failed");
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error.message);
    throw error;
  }
};

const getOrdersByDriverId = async (driverId) => {
  try {
    const orders = await Order.find({ assignedShipperId: driverId })
      .populate({ path: "customerId", select: "name phone" })
      .populate({
        path: "restaurantId",
        select: "userId detailAddress provinceId districtId communeId",
        populate: { path: "userId", select: "name" },
      })
      .populate({
        path: "orderItems.itemId",
        select: "itemName",
      })
      .populate({
        path: "assignedShipperId",
        select: "userId licensePlate profileUrl",
        populate: { path: "userId", select: "name phone" },
      });

    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this driver.");
    }

    const ordersDetails = orders.map((order) => {
      return {
        id: order._id,
        customerName: order.customerId?.name || "Unknown",
        custPhone: order.customerId?.phone || "Unknown",
        restaurantName: order.restaurantId?.userId?.name || "Unknown",
        restDetailAddress: order.restaurantId?.detailAddress || "Unknown",
        restProvinceId: order.restaurantId?.provinceId || "Unknown",
        restDistrictId: order.restaurantId?.districtId || "Unknown",
        restCommuneId: order.restaurantId?.communeId || "Unknown",
        driverName: order.assignedShipperId?.userId?.name || "Unknown",
        driverPhone: order.assignedShipperId?.userId?.phone || "Unknown",
        driverLicensePlate: order.assignedShipperId?.licensePlate || "Unknown",
        driverProfileUrl: order.assignedShipperId?.profileUrl || "Unknown",
        custShipperRating: order.custShipperRating,
        custResRating: order.custResRating,
        custAddress: order.custAddress || "Unknown",
        custResRatingComment: order.custResRatingComment || "Unknown",
        custShipperRatingComment: order.custShipperRatingComment || "Unknown",
        deliveryFee: order.deliveryFee,
        orderDatetime: order.orderDatetime,
        note: order.note,
        reason: order.reason || "",
        custStatus: order.custStatus,
        driverStatus: order.driverStatus,
        restStatus: order.restStatus,
        orderItems: order.orderItems.map((item) => ({
          itemName: item.itemId?.itemName || "Unknown",
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          id: item._id,
        })),
        totalPrice: order.totalPrice,
      };
    });

    return ordersDetails;
  } catch (error) {
    console.error("Error fetching orders by driver ID:", error.message);
    throw error;
  }
};

const getOrdersByCustomerId = async (customerId) => {
  try {
    const orders = await Order.find({ customerId: customerId })
      .populate({ path: "customerId", select: "name phone" })
      .populate({
        path: "restaurantId",
        select: "userId detailAddress provinceId districtId communeId",
        populate: { path: "userId", select: "name" },
      })
      .populate({
        path: "orderItems.itemId",
        select: "itemName",
      })
      .populate({
        path: "assignedShipperId",
        select: "userId licensePlate profileUrl",
        populate: { path: "userId", select: "name phone" },
      });

    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this driver.");
    }

    const ordersDetails = orders.map((order) => {
      return {
        id: order._id,
        customerName: order.customerId?.name || "Unknown",
        custAddress: order.custAddress || "Unknown",
        custPhone: order.customerId?.phone || "Unknown",
        restaurantName: order.restaurantId?.userId?.name || "Unknown",
        restDetailAddress: order.restaurantId?.detailAddress || "Unknown",
        restProvinceId: order.restaurantId?.provinceId || "Unknown",
        restDistrictId: order.restaurantId?.districtId || "Unknown",
        restCommuneId: order.restaurantId?.communeId || "Unknown",
        driverName: order.assignedShipperId?.userId?.name || "Unknown",
        driverPhone: order.assignedShipperId?.userId?.phone || "Unknown",
        driverLicensePlate: order.assignedShipperId?.licensePlate || "Unknown",
        driverProfileUrl: order.assignedShipperId?.profileUrl || "Unknown",
        custShipperRating: order.custShipperRating,
        custResRating: order.custResRating,
        custResRatingComment: order.custResRatingComment || "Unknown",
        custShipperRatingComment: order.custShipperRatingComment || "Unknown",
        deliveryFee: order.deliveryFee,
        orderDatetime: order.orderDatetime,
        note: order.note,
        reason: order.reason || "",
        custStatus: order.custStatus,
        driverStatus: order.driverStatus,
        restStatus: order.restStatus,
        orderItems: order.orderItems.map((item) => ({
          itemName: item.itemId?.itemName || "Unknown",
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          id: item._id,
        })),
        totalPrice: order.totalPrice,
      };
    });

    return ordersDetails;
  } catch (error) {
    console.error("Error fetching orders by driver ID:", error.message);
    throw error;
  }
};

const getOrdersByPartnerId = async (restaurantId) => {
  try {
    const orders = await Order.find({ restaurantId: restaurantId })
      .populate({ path: "restaurantId", select: "name phone" })
      .populate({
        path: "restaurantId",
        select: "userId detailAddress provinceId districtId communeId",
        populate: { path: "userId", select: "name" },
      })
      .populate({
        path: "orderItems.itemId",
        select: "itemName",
      })
      .populate({
        path: "assignedShipperId",
        select: "userId licensePlate profileUrl",
        populate: { path: "userId", select: "name phone" },
      });

    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this restaurant.");
    }

    const ordersDetails = orders.map((order) => {
      return {
        id: order._id,
        customerName: order.customerId?.name || "Unknown",
        custPhone: order.customerId?.phone || "Unknown",
        restaurantName: order.restaurantId?.userId?.name || "Unknown",
        restDetailAddress: order.restaurantId?.detailAddress || "Unknown",
        restProvinceId: order.restaurantId?.provinceId || "Unknown",
        restDistrictId: order.restaurantId?.districtId || "Unknown",
        restCommuneId: order.restaurantId?.communeId || "Unknown",
        driverName: order.assignedShipperId?.userId?.name || "Unknown",
        driverPhone: order.assignedShipperId?.userId?.phone || "Unknown",
        driverLicensePlate: order.assignedShipperId?.licensePlate || "Unknown",
        driverProfileUrl: order.assignedShipperId?.profileUrl || "Unknown",
        custShipperRating: order.custShipperRating,
        custResRatingComment: order.custResRatingComment || "Unknown",
        custShipperRatingComment: order.custShipperRatingComment || "Unknown",
        custResRating: order.custResRating,
        deliveryFee: order.deliveryFee,
        orderDatetime: order.orderDatetime,
        note: order.note,
        reason: order.reason || "",
        custStatus: order.custStatus,
        driverStatus: order.driverStatus,
        restStatus: order.restStatus,
        orderItems: order.orderItems.map((item) => ({
          itemName: item.itemId?.itemName || "Unknown",
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          id: item._id,
        })),
        totalPrice: order.totalPrice,
      };
    });

    return ordersDetails;
  } catch (error) {
    console.error("Error fetching orders by partner ID:", error.message);
    throw error;
  }
};

const getOrderDetails = async (orderId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const order = await Order.findById(orderId).populate(
      "customer_id restaurant_id assigned_shipper_id"
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    throw error;
  }
};

const getOrdersByDriverStatus = async (status) => {
  try {
    const orders = await Order.find({ driverStatus: status })
      .populate({ path: "customerId", select: "name phone" })
      .populate({
        path: "restaurantId",
        select: "userId detailAddress provinceId districtId communeId",
        populate: { path: "userId", select: "name" },
      })
      .populate({
        path: "orderItems.itemId",
        select: "itemName",
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

const getOrderByPartnerStatus = async (partnerId, status) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      throw new Error("Invalid restaurantId format");
    }
    const order = await Order.find({
      restaurantId: partnerId,
      restStatus: status,
      assignedShipperId: { $ne: null },
    });
    if (!order || order.length === 0) throw new Error("Order not found!");

    const detailedOrders = [];
    for (let x of order) {
      const detail = await getOrderById(x._id);
      detailedOrders.push(detail);
    }

    return detailedOrders;
  } catch (e) {
    throw e;
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate({ path: "customerId", select: "name phone" })
      .populate({
        path: "restaurantId",
        select: "userId detailAddress provinceId districtId communeId",
        populate: { path: "userId", select: "name" },
      })
      .populate({
        path: "orderItems.itemId",
        select: "itemName",
      })
      .populate({
        path: "assignedShipperId",
        select: "userId assignedShipperId licensePlate profileUrl",
        populate: { path: "userId", select: "name phone" },
      });
    if (!order) {
      throw new Error("Order not found");
    }

    const orderDetails = {
      id: order._id,
      customerName: order.customerId?.name || "Unknown",
      custAddress: order.custAddress || "Unknown",
      custPhone: order.customerId?.phone || "Unknown",
      restaurantId: order.restaurantId?._id || "Unknown",
      restaurantName: order.restaurantId?.userId?.name || "Unknown",
      restDetailAddress: order.restaurantId?.detailAddress || "Unknown",
      restProvinceId: order.restaurantId?.provinceId || "Unknown",
      restDistrictId: order.restaurantId?.districtId || "Unknown",
      restCommuneId: order.restaurantId?.communeId || "Unknown",
      assignedShipperId: order.assignedShipperId?._id,
      driverName: order.assignedShipperId?.userId?.name || "Unknown",
      driverPhone: order.assignedShipperId?.userId?.phone || "Unknown",
      driverLicensePlate: order.assignedShipperId?.licensePlate || "Unknown",
      driverProfileUrl: order.assignedShipperId?.profileUrl || "Unknown",
      custShipperRating: order.custShipperRating,
      custResRating: order.custResRating,
      deliveryFee: order.deliveryFee,
      custResRatingComment: order.custResRatingComment || "Unknown",
      custShipperRatingComment: order.custShipperRatingComment || "Unknown",
      orderDatetime: order.orderDatetime,
      note: order.note,
      reason: order.reason || "",
      custStatus: order.custStatus,
      driverStatus: order.driverStatus,
      restStatus: order.restStatus,

      orderItems: order.orderItems.map((item) => ({
        foodId: item.itemId._id || "",
        itemName: item.itemId?.itemName || "Unknown",
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        id: item._id,
      })),
      totalPrice: order.totalPrice,
    };

    return orderDetails;
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
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

const updateRating = async (orderId, updates) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (updates.custResRating !== undefined) {
      order.custResRating = updates.custResRating;
    }
    if (updates.custResRatingComment !== undefined) {
      order.custResRatingComment = updates.custResRatingComment;
    }
    if (updates.custShipperRating !== undefined) {
      order.custShipperRating = updates.custShipperRating;
    }
    if (updates.custShipperRatingComment !== undefined) {
      order.custShipperRatingComment = updates.custShipperRatingComment;
    }

    await order.save();
    return order;
  } catch (error) {
    console.error("Update rating fail:", error.message);
    throw error;
  }
}
module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getOrdersByCustomerId,
  getOrdersByPartnerId,
  getOrdersByDriverStatus,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getOrdersByDriverId,
  getOrderByPartnerStatus,
  updateRating
};
