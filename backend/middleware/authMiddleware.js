const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateUser = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) res.json({ error: "Token not found" });

        const decoded = jwt.verify(token, process.env.JWTKEY);

        if (!decoded) res.json({ error: "Invalid token" });

        const user = await User.findOne({ _id: decoded?.userId });

        if (!user) res.json({ error: "User not found" });

        req.user = user;
        next();
    } catch (e) {}
};

module.exports = { validateUser };
