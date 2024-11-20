const express = require("express");
const { loadListUser, loadListUserByRoleAndStatus, approveUser } = require("../controllers/UserController");

const router = express.Router();

router.get("/", loadListUser);
router.get("/filter", loadListUserByRoleAndStatus);
router.put("/approve/:userId", approveUser);

module.exports = router;
