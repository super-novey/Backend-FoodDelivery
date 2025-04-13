const orderHandler = require('./orderHandler')

module.exports = (socket, io) => {
    orderHandler(socket,io)
}