const AsyncHandler = require("express-async-handler");
const OrderService = require("../services/OrderServices");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const ApiError = require("./error/ApiError");
const { getIO } = require("../config/socket");
const Order = require("../models/Order");

// Create a new order
const createOrder = AsyncHandler(async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = await OrderService.createOrder(orderData);

    const io = getIO();

    const detailOrder = await OrderService.getOrderById(newOrder._id);

    io.emit("order:new", detailOrder);

    res
      .status(StatusCodes.CREATED)
      .json(
        ApiResponse("Order created successfully", newOrder, StatusCodes.CREATED)
      );
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse(
          "Failed to create order",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
  }
});

const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { custStatus, driverStatus, restStatus, assignedShipperId, reason } = req.body; // Expect statuses and assignedShipperId

  try {
    const statusUpdates = {
      ...(custStatus && { custStatus }),
      ...(driverStatus && { driverStatus }),
      ...(restStatus && { restStatus }),
      ...(assignedShipperId && { assignedShipperId }),
      ...(reason && { reason }),
    };

    const updatedOrder = await OrderService.updateOrderStatus(
      orderId,
      statusUpdates
    );

    const io = getIO();
    const detailOrder = await OrderService.getOrderById(updatedOrder._id);

    io.emit("order:new", detailOrder);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          "Trạng thái đơn hàng đã được cập nhật.",
          updatedOrder,
          StatusCodes.OK
        )
      );
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ApiResponse(
          error.message || "Cập nhật trạng thái đơn hàng thất bại.",
          null,
          StatusCodes.BAD_REQUEST
        )
      );
  }
});

// Update an existing order
const updateOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const orderUpdates = req.body;

  try {
    const updatedOrder = await OrderService.updateOrder(orderId, orderUpdates);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Order updated successfully", updatedOrder, StatusCodes.OK)
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "Order not found or update failed",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }
});

// Get order details by ID
const getOrderDetails = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderService.getOrderDetails(orderId);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          "Order details retrieved successfully",
          order,
          StatusCodes.OK
        )
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("Order not found", null, StatusCodes.NOT_FOUND));
  }
});

const getOrdersByDriverId = AsyncHandler(async (req, res) => {
  const { driverId } = req.params;

  try {
    const orders = await OrderService.getOrdersByDriverId(driverId);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Orders retrieved successfully", orders, StatusCodes.OK)
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "No orders found for this customer",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }
});

const getOrdersByCustomerId = AsyncHandler(async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await OrderService.getOrdersByCustomerId(customerId);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Orders retrieved successfully", orders, StatusCodes.OK)
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "No orders found for this customer",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }
});

const getOrdersByPartnerId = AsyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  console.log(restaurantId);
  try {
    const orders = await OrderService.getOrdersByPartnerId(restaurantId);

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse("Orders retrieved successfully", orders, StatusCodes.OK)
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "No orders found for this restaurant",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }
});

const getOrderById = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ApiResponse(
          "Order ID parameter is required",
          null,
          StatusCodes.BAD_REQUEST
        )
      );
  }

  try {
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("Order not found", null, StatusCodes.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          `Order with ID "${orderId}" retrieved successfully`,
          order,
          StatusCodes.OK
        )
      );
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse(
          "An error occurred while fetching the order",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
  }
});

const getOrdersByDriverStatus = AsyncHandler(async (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ApiResponse(
          "Status parameter is required",
          null,
          StatusCodes.BAD_REQUEST
        )
      );
  }

  try {
    const orders = await OrderService.getOrdersByDriverStatus(status);

    if (!orders || orders.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          ApiResponse(
            "No orders found with the specified status",
            null,
            StatusCodes.NOT_FOUND
          )
        );
    }

    const orderDetails = orders.map((order) => ({
      id: order._id,
      customerName: order.customerId?.name || "Unknown",
      custAddress: order.custAddress || "Unknown",
      custPhone: order.customerId?.phone || "Unknown",
      restaurantName: order.restaurantId?.userId?.name || "Unknown",
      restDetailAddress: order.restaurantId?.detailAddress || "Unknown",
      restProvinceId: order.restaurantId?.provinceId || "Unknown",
      restDistrictId: order.restaurantId?.districtId || "Unknown",
      restCommuneId: order.restaurantId?.communeId || "Unknown",
      assignedShipperId: order.assignedShipperId || null,
      custShipperRating: order.custShipperRating,
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
    }));

    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          `Orders with status "${status}" retrieved successfully`,
          orderDetails,
          StatusCodes.OK
        )
      );
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse(
          "An error occurred while fetching orders",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
  }
});

const getAllOrders = AsyncHandler(async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          `Fetch orders retrieved successfully`,
          orders,
          StatusCodes.OK
        )
      );
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse("No orders found.", null, StatusCodes.NOT_FOUND));
  }
});

const getOrderByPartnerStatus = AsyncHandler(async (req, res) => {
  const { partnerId, status } = req.query;

  if (!partnerId || !status) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        ApiResponse(
          "partnerId and status are required.",
          null,
          StatusCodes.BAD_REQUEST
        )
      );
  }
  const orders = await OrderService.getOrderByPartnerStatus(partnerId, status);

  if (!orders || orders.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        ApiResponse(
          "No orders found for the given partnerId and status.",
          null,
          StatusCodes.NOT_FOUND
        )
      );
  }

  return res
    .status(StatusCodes.OK)
    .json(
      ApiResponse("Orders retrieved successfully.", orders, StatusCodes.OK)
    );
});

const updateOrderRating = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const updates = req.body;

  if (
    updates.custResRating !== undefined &&
    (updates.custResRating < 1 || updates.custResRating > 5)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "custResRating must be between 1 and 5",
    });
  }
  if (
    updates.custShipperRating !== undefined &&
    (updates.custShipperRating < 1 || updates.custShipperRating > 5)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "custShipperRating must be between 1 and 5",
    });
  }

  try {
    const updatedOrder = await OrderService.updateRating(orderId, updates);

    if (!updatedOrder) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ApiResponse("Order not found.", [], StatusCodes.NOT_FOUND));
    }

    return res
      .status(StatusCodes.OK)
      .json(
        ApiResponse(
          "Order ratings updated successfully.",
          updatedOrder,
          StatusCodes.OK
        )
      );
  } catch (error) {
    console.error("Error updating ratings:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update order ratings.",
    });
  }
});
const getAllRatingByItem = async (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  try {
    const ratings = await OrderService.getRatingsByItem(itemId);
    console.log(ratings);

    return res.status(200).json({
      message: "Ratings retrieved successfully.",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getAllRatingByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const ratings = await OrderService.getRatingsByRestaurant(restaurantId);

    return res.status(200).json({
      message: "Ratings retrieved successfully.",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getAllRatingByDriver = async (req, res) => {
  const { assignedShipperId } = req.params;

  try {
    const ratings = await OrderService.getRatingsByDriver(assignedShipperId);

    return res.status(200).json({
      message: "Ratings retrieved successfully.",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getAllRatingByCustomer = async (req, res) => {
  const { customerId } = req.params;

  try {
    const ratings = await OrderService.getRatingsByCustomer(customerId);

    return res.status(200).json({
      message: "Ratings retrieved successfully.",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  updateOrder,
  updateOrderStatus,
  getOrderDetails,
  getOrdersByCustomerId,
  getOrdersByPartnerId,
  getOrdersByDriverStatus,
  getAllOrders,
  getOrderById,
  getOrdersByDriverId,
  getOrderByPartnerStatus,
  updateOrderRating,
  getAllRatingByItem,
  getAllRatingByRestaurant,
  getAllRatingByDriver,
  getAllRatingByCustomer
};
