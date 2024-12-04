const OrderService = require("../../services/OrderServices");

module.exports = (socket, io) => {
  socket.on("order:create", async (orderData) => {
    const orderJson = JSON.parse(orderData);
    console.log(`Order created: ${orderJson.id}`);
    const detailOrder = await OrderService.getOrderById(orderJson.id);
    // send to all drivers
    io.emit("order:created", detailOrder);
  });

  socket.on("order:updateStatus", async (orderData) => {
    console.log(`Order updated: ${orderData.orderId}`);

    try {
      // Fetch detailed order information
      const detailOrder = await OrderService.getOrderById(orderData.orderId);

      if (!detailOrder) {
        console.log(`Order not found: ${orderData.orderId}`);
        return;
      }

      console.log(`Detail Order Retrieved:`, detailOrder);

      // Check conditions
      if (detailOrder.assignedShipperId && detailOrder.restStatus === "new") {
        const roomId = detailOrder.restaurantId.toString();

        if (roomId) {
          // Emit to the specific room
          io.to(roomId).emit("order:updatedStatus", detailOrder);

          console.log(`Emitted order details to room: ${roomId}`);
        } else {
          console.log(`Restaurant ID is missing for order: ${detailOrder.id}`);
        }
      } else {
        console.log(
          `Conditions not met for emitting: assignedShipperId=${detailOrder.assignedShipperId}, restStatus=${detailOrder.restStatus}`
        );
      }
    } catch (error) {
      console.error(`Error updating order status: ${error.message}`);
    }
  });
};
