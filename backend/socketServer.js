const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const userMap = {};

const getReceiverSocketId = (receiverId) => {
    return userMap[receiverId];
};
io.on("connection", (socket) => {
    console.log("A user connected");
    const userId = socket.handshake.query.userId;
    if (userId != undefined) userMap[userId] = socket.id;
    socket.on("disconnect", () => {
        console.log("A user disconnected");
        delete userMap[userId];
    });
});

module.exports = { app, server, io, getReceiverSocketId };