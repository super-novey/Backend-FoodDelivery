const express = require("express");
const { loadListUser } = require("../controllers/UserController");

const router = express.Router();

router.get("/", loadListUser);

module.exports = router;
