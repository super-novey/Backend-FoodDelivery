const express = require("express");
const { loadListUser, loadListUserByRoleAndStatus, approveUser, updateUser, deleteUser, deleteApprove, getUserByUserId } = require("../controllers/UserController");

const router = express.Router();

router.get("/", loadListUser);
router.get("/approve", loadListUserByRoleAndStatus);
router.put("/approve/:userId", approveUser);
router.put("/:userId", updateUser)
router.put("/delete/:userId", deleteUser);
router.delete("/:userId", deleteApprove);
router.get("/:id", getUserByUserId);
module.exports = router;
