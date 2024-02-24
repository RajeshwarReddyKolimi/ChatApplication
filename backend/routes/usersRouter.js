const express = require("express");
const {
    getAllUsers,
    getAUser,
    getSearchUser,
} = require("../controller/usersController");
const { validateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", validateUser, getAllUsers);
router.get("/search", validateUser, getSearchUser);
router.get("/:id", validateUser, getAUser);

module.exports = router;
