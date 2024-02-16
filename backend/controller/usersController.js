const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const user = req.user;
        const userId = user?._id;
        const users = await User.find({
            fullname: new RegExp(q, "i"),
            _id: { $ne: userId },
        });
        res.json(users);
    } catch (e) {
        console.error(e);
    }
};

module.exports = { getAllUsers };
