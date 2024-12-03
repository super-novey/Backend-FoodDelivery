const express = require("express");
const router = express.Router();

const {
  createPartner,
  delelePartner,
  getPartnerById,
  getPartnerByPartnerId,
  updateStatus,
} = require("../controllers/PartnerController");
const OrderController = require("../controllers/OrderController");

const AuthMiddleWare = require("../middlewares/AuthMiddleWare");
router.get("/:id", getPartnerById);
router.post("/", createPartner);
router.delete("/:id", delelePartner);
// router.put("/:id", updateDateDriver);
router.get("/customer/:id", getPartnerByPartnerId);
router.put("/updateStatus/:userId", updateStatus);
router.get("/rating/:restaurantId", OrderController.getAllRatingByRestaurant);
module.exports = router;
