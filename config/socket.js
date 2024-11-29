const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST"],
    },
    transports: ["websocket"], // Ensure WebSocket is supported
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call initializeSocket first."
    );
  }
  return io;
};

module.exports = { initializeSocket, getIO };
