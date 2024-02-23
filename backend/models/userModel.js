const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        dp: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
