const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        default: "",
    },
    messages: [
        {
            user: String,
            msgs: [
                {
                    sentOrReceived: String,
                    msg: String,
                },
            ],
        },
    ],
});
module.exports = mongoose.model("ChatUser", userSchema);
