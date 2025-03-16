const express = require("express");
const router = express.Router();
const MapController = require("../controllers/MapController");

router.post("/route", MapController.getRoute);
router.get("/coordinates", MapController.getCoordinates);
router.get("/distance", MapController.getDistance);

module.exports = router;
