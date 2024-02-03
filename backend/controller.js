const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        newUser.save();
        res.json({ message: "User created" });
    } catch (e) {
        console.error(e);
    }
};
const getAllUsers = async (req, res) => {
    try {
        const { username } = req.params;
        const users = await User.find();
        const otherUsers = users.filter((user) => user.username != username);
        res.json(otherUsers);
    } catch (e) {
        console.error(e);
    }
};
const getMessages = async (req, res) => {
    try {
        const { username, friend } = req.params;
        const user = await User.findOne({ username });
        if (!user) res.json({ message: "User not found" });
        if (user.messages.length === 0) {
            user.messages.push({ user: friend, msgs: [] });
        }
        await user.save();
        let friendInd = await user.messages.findIndex(
            (msg) => msg.user == friend
        );
        if (friendInd == -1) {
            user.messages.push({ user: friend, msgs: [] });
        }
        friendInd = await user.messages.findIndex((msg) => msg.user == friend);
        res.json(user?.messages[friendInd]?.msgs);
    } catch (e) {
        console.error(e);
    }
};
const putMessage = async (req, res) => {
    try {
        const { username, friend } = req.params;
        const { message } = req.body;
        const user = await User.findOne({ username });
        if (!user) res.json({ message: "User not found" });
        if (user.messages.length === 0) {
            user.messages.push({ user: friend, msgs: [] });
        }
        let friendInd = await user.messages.findIndex(
            (msg) => msg.user == friend
        );
        if (friendInd == -1) {
            user.messages.push({ user: friend, msgs: [] });
        }
        friendInd = await user.messages.findIndex((msg) => msg.user == friend);
        user.messages[friendInd].msgs.push({
            sentOrReceived: "Sent",
            msg: message,
        });
        await user.save();

        const receiver = await User.findOne({ username: friend });
        if (!receiver) res.json({ message: "Receiver not found" });
        if (receiver.messages.length === 0) {
            receiver.messages.push({ user: username, msgs: [] });
        }
        let userInd = await receiver.messages.findIndex(
            (msg) => msg.user == username
        );
        if (userInd == -1) {
            receiver.messages.push({ user: username, msgs: [] });
        }
        userInd = await receiver.messages.findIndex(
            (msg) => msg.user == username
        );
        receiver.messages[userInd].msgs.push({
            sentOrReceived: "Received",
            msg: message,
        });
        await receiver.save();

        res.json(user.messages[friendInd].msgs);
    } catch (e) {
        console.error(e);
    }
};
const assignSocketId = async (username, id) => {
    try {
        const user = await User.findOne({ username });
        user.socketId = id;
        await user.save();
    } catch (e) {
        console.error(e);
    }
};
const getSocketId = async (username) => {
    try {
        const user = await User.findOne({ username });
        return user.socketId;
    } catch (e) {
        console.error(e);
    }
};
const sendMessage = async ({ username, friend, message }) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return;
        if (user.messages.length === 0) {
            user.messages.push({ user: friend, msgs: [] });
        }
        let friendInd = await user.messages.findIndex(
            (msg) => msg.user == friend
        );
        if (friendInd == -1) {
            user.messages.push({ user: friend, msgs: [] });
        }
        friendInd = await user.messages.findIndex((msg) => msg.user == friend);
        user.messages[friendInd].msgs.push({
            sentOrReceived: "Sent",
            msg: message,
        });
        await user.save();

        const receiver = await User.findOne({ username: friend });
        if (!receiver) return;
        if (receiver.messages.length === 0) {
            receiver.messages.push({ user: username, msgs: [] });
        }
        let userInd = await receiver.messages.findIndex(
            (msg) => msg.user == username
        );
        if (userInd == -1) {
            receiver.messages.push({ user: username, msgs: [] });
        }
        userInd = await receiver.messages.findIndex(
            (msg) => msg.user == username
        );
        receiver.messages[userInd].msgs.push({
            sentOrReceived: "Received",
            msg: message,
        });
        await receiver.save();
        return user.messages[friendInd].msgs;
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    register,
    getAllUsers,
    assignSocketId,
    getSocketId,
    getMessages,
    putMessage,
    sendMessage,
};
