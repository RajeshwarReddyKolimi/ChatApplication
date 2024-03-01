const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { generateJWTToken } = require("../utils/generateToken");
const register = async (req, res) => {
    try {
        const { username, password, fullname, gender } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) res.json({ error: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const dp =
            gender == "Male"
                ? `https://avatar.iran.liara.run/public/boy?username=${username}`
                : `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            username,
            password: hashedPassword,
            fullname,
            gender,
            dp,
        });

        generateJWTToken(newUser._id, res);
        await newUser.save();

        res.json(newUser);
    } catch (e) {
        console.error(e);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.json({ error: "Username does not exist" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password || ""
        );

        if (!isPasswordCorrect) {
            res.json({ error: "Incorrect password" });
            return;
        }

        generateJWTToken(user._id, res);

        res.json({ user: user });
    } catch (e) {
        console.error(e);
    }
};

const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        req.user = null;
        res.json({ message: "Logged out" });
    } catch (e) {
        console.error(e);
    }
};

const getDetails = async (req, res) => {
    try {
        res.json(req.user);
    } catch (e) {
        console.error(e);
    }
};
module.exports = { register, login, logout, getDetails };
