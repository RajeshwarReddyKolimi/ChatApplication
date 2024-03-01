const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");

const getAllUsers = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?._id;
        const conversation = await Conversation.find(
            {
                participants: { $in: [userId] },
            },
            { _id: 0, participants: 1 }
        )
            .sort({ updatedAt: -1 })
            .populate("participants");
        const contacts = conversation.map((c) =>
            c.participants[0]._id.toString() === userId.toString()
                ? c.participants[1]
                : c.participants[0]
        );
        res.json(contacts);
    } catch (e) {
        console.error(e);
    }
};

const getSearchUser = async (req, res) => {
    try {
        const { q } = req.query;
        const user = req.user;
        const userId = user?._id;
        const users = await User.find({
            $or: [
                { fullname: new RegExp(q, "i") },
                { username: new RegExp(q, "i") },
            ],
            _id: { $ne: userId },
        });

        res.json(users);
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

module.exports = { getAllUsers, getAUser, getSearchUser };
