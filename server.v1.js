const app = require("./app");
const socketIO = require("./sockets/init.socket");


const PORT = process.env.PORT || 8888;

const server = app.listen(PORT, () => {
    console.log(`Food delivery start with port ${PORT}`)
})

socketIO.init(server)

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})