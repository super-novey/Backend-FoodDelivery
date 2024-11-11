/*==============================
core packages
==============================*/
const express = require('express')
const dotenv = require("dotenv");
dotenv.config()

/*==============================
include Routes and database connection
==============================*/
const DBConnect = require("./config/db")
const Routes = require("./routes");

/*==============================
include environment variables
==============================*/
const port = process.env.PORT || 8888;
const hostName = process.env.HOSTNAME

/*==============================
server application configurations
==============================*/
DBConnect()
const app = express()
app.use(express.json());

/*==============================
routes
==============================*/
app.use("/api/v1", Routes); // routes and prefix


/*==============================
start server listen
==============================*/
app.listen(port, hostName, () => {
    console.log(`app listening on port ${port}`)
})