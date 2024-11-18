const express = require("express");
const { loadListUser, loadListUserByRoleAndStatus  } = require("../controllers/UserController");

const router = express.Router();

router.get("/", loadListUser);
router.get("/filter", loadListUserByRoleAndStatus);

module.exports = router;
