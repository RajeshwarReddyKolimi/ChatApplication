const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");

const getAllUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const user = req.user;
        const userId = user?._id;
        const users = await User.find({
            fullname: new RegExp(q, "i"),
            _id: { $ne: userId },
        });

        const conversation = await Conversation.find({
            participants: { $in: [userId] },
        })
            .sort({ updatedAt: 1 })
            .populate("participants")
            .populate("messages");
        res.json(conversation);
    } catch (e) {
        console.error(e);
    }
};
const getAUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, { password: 0 }).sort({
            updatatedAt: 1,
        });
        res.json(user);
    } catch (e) {
        console.error(e);
    }
};

module.exports = { getAllUsers, getAUser };
