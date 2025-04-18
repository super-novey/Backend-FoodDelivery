require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require("helmet")
const compression = require('compression')

const { initializeSocket } = require("./sockets");

const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// init db
require('./dbs/init.mongodb')


// init router
app.use("/api/v1", require('./routes'));


// hanling error
app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        stack: error.stack,
        code: statusCode,
        message: error.message || "Internal Server Error"
    })
})


module.exports = app

