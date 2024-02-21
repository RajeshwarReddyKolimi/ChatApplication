const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateUser = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) throw new Error("Token not found");

        const decoded = jwt.verify(token, process.env.JWTKEY);

        if (!decoded) throw new Error("Invalid token");

        const user = await User.findOne({ _id: decoded?.userId });

        if (!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch (e) {}
};

module.exports = { validateUser };
