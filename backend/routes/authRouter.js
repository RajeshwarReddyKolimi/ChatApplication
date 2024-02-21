const express = require("express");
const {
    register,
    login,
    logout,
    getDetails,
} = require("../controller/authController");
const { validateUser } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", validateUser, getDetails);

module.exports = router;
