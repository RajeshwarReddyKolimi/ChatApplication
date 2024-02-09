const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const generateJWTToken = async (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWTKEY, {
            expiresIn: "3d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/",
            sameSite: "None",
        });
    } catch (e) {}
};

module.exports = { generateJWTToken };
