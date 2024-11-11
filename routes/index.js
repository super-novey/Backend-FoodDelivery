const AsyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const ApiResponse = require("../controllers/response/ApiResponse");
const { StatusCodes } = require("http-status-codes");
const AuthMiddleWare = require("../middlewares/AuthMiddleWare")

// importing all routes
const AuthRoutes = require("./AuthRoutes");


router.use(
    "/test",
    AuthMiddleWare,
    AsyncHandler(async (req, res) => {
      res.json(
        ApiResponse("Api Running Successfully.", null, StatusCodes.CREATED)
      );
    })
  );


// assign prefix - to routes
router.use("/auth", AuthRoutes);

module.exports = router;
