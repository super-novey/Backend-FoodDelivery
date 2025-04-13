const app = require("./app");
const { initializeSocket } = require("./sockets");


const PORT = process.env.PORT || 8888;

const server = app.listen(PORT, () => {
    console.log(`Food delivery start with port ${PORT}`)
})

initializeSocket(server)


process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})