const AsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const ApiResponse = require("../controllers/response/ApiResponse");
const { StatusCodes } = require("http-status-codes");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare");

// importing all routes
const AuthRoutes = require("./AuthRoutes");
const DriverRoutes = require("./DriverRoutes");
const PartnerRoutes = require("./PartnerRoutes");
const CategoryRoutes = require("./CategoryRoutes");
const UserRoutes = require("./UserRoutes");
const ItemRoutes = require("./ItemRoutes");
const OrderRoutes = require("./OrderRoutes");

// assign prefix - to routes
router.use("/auth", AuthRoutes);
router.use("/driver", DriverRoutes);
router.use("/partner", PartnerRoutes);
router.use("/category", CategoryRoutes);
router.use("/user", UserRoutes);
router.use("/item", ItemRoutes);
router.use("/order", OrderRoutes);

module.exports = router;
