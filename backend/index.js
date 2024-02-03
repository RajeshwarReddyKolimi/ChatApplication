const express = require("express");
const dbConnect = require("./dbConnect");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");
const router = require("./router");
const bodyParser = require("body-parser");
const { assignSocketId } = require("./controller");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {},
    maxHttpBufferSize: 1e8,
});

dbConnect();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", router);
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

let users = {};
io.on("connection", (socket) => {
    socket.on("username", (username) => {
        users[username] = socket.id;
        console.log(username, "connected");
    });
    socket.on("msg", ({ sender, receiver, data }) => {
        const senderId = users[sender];
        const receiverId = users[receiver];
        console.log(sender, "to", receiver, ":", data);
        io.to(receiverId).emit("receivedMsg", data);
        io.to(senderId).emit("sentMsg", data);
    });
    socket.on("file", ({ sender, receiver, file }) => {
        console.log(sender, " to ", receiver);
        const senderId = users[sender];
        const receiverId = users[receiver];
        if (file) {
            io.to(receiverId).emit("receivedFile", file);
            io.to(senderId).emit("sentFile", file);
        } else {
            io.to(receiverId).emit("msg", { data: "No file found" });
        }
    });
    socket.on("disconnect", () => {
        for (let username in users) {
            if (users[username] === socket.id) {
                console.log("User ", username, " disconnected...");
                delete users[username];
                break;
            }
        }
    });
});

server.listen(3000, () => {
    console.log("Listening...");
});
