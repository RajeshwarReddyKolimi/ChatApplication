const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const { getReceiverSocketId, io } = require("../socketServer");

const sendMessage = async (req, res) => {
    try {
        const sender = req.user;
        const senderId = sender?.id;
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const receiver = await User.findOne({ _id: receiverId });

        if (!receiver) res.json({ error: "Receiver not found" });

        const msg = await new Message({
            senderId: sender?.id,
            receiverId: receiverId,
            message,
        });
        await msg.save();

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation)
            conversation = await new Conversation({
                participants: [senderId, receiverId],
            });

        conversation.messages.push(msg?._id);
        await conversation.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId)
            io.to(receiverSocketId).emit("message", { senderId, message });
        io.emit("newMessage");
        res.json({ message: "Message sent" });
    } catch (e) {
        console.error(e);
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const sender = req.user;
        const senderId = sender?.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation)
            conversation = await new Conversation({
                participants: [senderId, receiverId],
            }).populate("messages");

        res.json(conversation.messages);
    } catch (e) {
        console.error(e);
    }
};

module.exports = { sendMessage, getMessages };
