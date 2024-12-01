const AsyncHandler = require("express-async-handler");
const OrderService = require("../services/OrderServices");
const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("./response/ApiResponse");
const ApiError = require("./error/ApiError");
const { getIO } = require("../config/socket");

// Create a new order
const createOrder = AsyncHandler(async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = await OrderService.createOrder(orderData);

    if (newOrder.restaurantId) {
      const io = getIO();
      const room = newOrder.restaurantId.toString();
      io.to(room).emit("order:new", newOrder);
      console.log(`Order sent to restaurant room: ${room}`);
    }

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
  const { custStatus, driverStatus, restStatus, assignedShipperId } = req.body; // Expect statuses and assignedShipperId

  try {
    const statusUpdates = {
      ...(custStatus && { custStatus }),
      ...(driverStatus && { driverStatus }),
      ...(restStatus && { restStatus }),
      ...(assignedShipperId && { assignedShipperId }),
    };

    const updatedOrder = await OrderService.updateOrderStatus(orderId, statusUpdates);

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

// Get all orders for a customer
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
  const { partnerId } = req.params;

  try {
    const orders = await OrderService.getOrdersByPartnerId(partnerId);

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
          "No orders found for this partner",
          null,
          StatusCodes.NOT_FOUND
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
      })
      ),
      totalPrice: order.totalPrice
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

module.exports = {
  createOrder,
  updateOrder,
  updateOrderStatus,
  getOrderDetails,
  getOrdersByCustomerId,
  getOrdersByPartnerId,
  getOrdersByDriverStatus,
  getAllOrders,
};
