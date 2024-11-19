const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const HandleBadRequest = require("../middlewares/HandleBadRequestMiddleware");
const AuthRoutesValidations = require("./validators/AuthRoutes.validators");
const upload = require("../config/multer");

router.post(
  "/login",
  AuthRoutesValidations.loginValidation,
  HandleBadRequest,
  AuthController.login
);

router.post("/register", AuthController.register);

router.post(
  "/driverRegister",
  upload.fields([
    { name: "profileUrl", maxCount: 1 },
    { name: "licenseFrontUrl", maxCount: 1 },
    { name: "licenseBackUrl", maxCount: 1 },
  ]),
  AuthController.driverRegister
);

router.post(
  "/partnerRegister",
  upload.fields([
    { name: "avatarUrl", maxCount: 1 },
    { name: "storeFront", maxCount: 1 },
    { name: "CCCDFrontUrl", maxCount: 1 },
    { name: "CCCDBackUrl", maxCount: 1 },
  ]),
  AuthController.partnerRegister
);

router.post("/verifyOTP", AuthController.verifyOtp);
router.post("/resendOTP", AuthController.resendOTP);

module.exports = router;
