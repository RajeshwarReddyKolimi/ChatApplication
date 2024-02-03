const express = require("express");
const {
    register,
    getAllUsers,
    getMessages,
    putMessage,
} = require("./controller");
const router = express.Router();
router.post("/register", register);
router.get("/users/:username", getAllUsers);
router.get("/:username/:friend/messages", getMessages);
router.put("/:username/:friend/messages", putMessage);
module.exports = router;
