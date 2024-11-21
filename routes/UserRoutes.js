const express = require("express");
const { loadListUser, loadListUserByRoleAndStatus, approveUser, updateUser } = require("../controllers/UserController");

const router = express.Router();

router.get("/", loadListUser);
router.get("/filter", loadListUserByRoleAndStatus);
router.put("/approve/:userId", approveUser);
router.put("/:userId", updateUser)

module.exports = router;
