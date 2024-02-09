const express = require("express");
const { sendMessage, getMessages } = require("../controller/messageController");
const { validateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id", validateUser, sendMessage);
router.get("/:id", validateUser, getMessages);
module.exports = router;
