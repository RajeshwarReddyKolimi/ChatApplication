const express = require("express");
const dbConnect = require("./utils/dbConnect");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const messageRouter = require("./routes/messageRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const { app, server } = require("./socketServer.js");

dbConnect();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://master--chitchat-by-rajeshwar.netlify.app",
            "https://chitchat-by-rajeshwar.netlify.app",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);

server.listen(4000, () => {
    console.log("Listening...");
});
