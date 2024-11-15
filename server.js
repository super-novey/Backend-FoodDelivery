/*==============================
core packages
==============================*/
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
dotenv.config();

/*==============================
include Routes and database connection
==============================*/
const DBConnect = require("./config/db");
const upload = require("./config/multer");
const Routes = require("./routes");

/*==============================
include environment variables
==============================*/
const port = process.env.PORT || 8888;
const hostName = process.env.HOSTNAME;

/*==============================
server application configurations
==============================*/
DBConnect();
const app = express();
app.use(express.json());
app.use(cors());

/*==============================
routes
==============================*/
app.use(
  upload.fields([
    { name: "single", maxCount: 1 },
    { name: "multiple", maxCount: 10 },
  ])
);
app.use("/api/v1", Routes); // routes and prefix

/*==============================
public endpoint for file/media access
==============================*/
app.use("/public", express.static(path.join(__dirname, "public")));
/*==============================
start server listen
==============================*/
app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`);
});
