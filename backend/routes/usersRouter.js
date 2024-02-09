const express = require("express");
const { getAllUsers } = require("../controller/usersController");
const { validateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", validateUser, getAllUsers);

module.exports = router;