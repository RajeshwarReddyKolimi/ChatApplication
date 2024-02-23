const express = require("express");
const { getAllUsers, getAUser } = require("../controller/usersController");
const { validateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", validateUser, getAllUsers);
router.get("/:id", validateUser, getAUser);

module.exports = router;
