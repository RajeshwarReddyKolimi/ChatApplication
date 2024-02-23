const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://master--chitchat-by-rajeshwar.netlify.app",
            "https://chitchat-by-rajeshwar.netlify.app",
        ],
        methods: ["GET", "POST"],
    },
});

const userMap = {};

const getReceiverSocketId = (receiverId) => {
    return userMap[receiverId];
};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("A user connected", userId);
    if (userId != undefined) userMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        delete userMap[userId];
        io.emit("getOnlineUsers", Object.keys(userMap));
    });
});

module.exports = { app, server, io, getReceiverSocketId };
