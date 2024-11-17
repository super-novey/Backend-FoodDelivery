const AsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const ApiResponse = require("../controllers/response/ApiResponse");
const { StatusCodes } = require("http-status-codes");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare")

// importing all routes
const AuthRoutes = require("./AuthRoutes");
const DriverRoutes = require("./DriverRoutes")
const PartnerRoutes = require("./PartnerRoutes")
const CategoryRoutes = require("./CategoryRoutes")
const UserRoutes = require("./UserRoutes")


// router.use(
//     "/test",
//     AuthMiddleWare,
//     AsyncHandler(async (req, res) => {
//       res.json(
//         ApiResponse("Api Running Successfully.", null, StatusCodes.CREATED)
//       );
//     })
//   );


// assign prefix - to routes
router.use("/auth", AuthRoutes);
router.use("/driver", DriverRoutes)
router.use("/partner", PartnerRoutes)
router.use("/category", CategoryRoutes)
router.use("/user", UserRoutes)

module.exports = router;
