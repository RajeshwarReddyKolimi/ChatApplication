import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { socket } from "../socket";

function Chat() {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();
    const inputFileRef = useRef();
    const url = `http://localhost:3000`;
    const { username, friend } = useParams();
    // const fetchMessages = async () => {
    //     const endpoint = `${username}/${friend}/messages`;
    //     try {
    //         const res = await axios.get(`${url}/${endpoint}`);
    //         const data = await res.data;
    //         setMessages(data);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    const sendMessage = async (e) => {
        e.preventDefault();
        const endpoint = `${username}/${friend}/messages`;
        const inputMessage = inputRef.current;
        const inputFile = inputFileRef?.current;
        if (inputMessage.value.trim() != "")
            socket.emit("msg", {
                sender: username,
                receiver: friend,
                data: inputMessage.value,
            });
        else if (inputFile.files.length > 0) {
            const file = inputFile.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const fileData = event.target.result;
                console.log("Sending...");
                console.log(fileData);
                socket.emit("file", {
                    sender: username,
                    receiver: friend,
                    file: fileData,
                });
                console.log("Sent..");
            };
            inputFile.value = "";
            reader.readAsDataURL(file);
        }
        // inputMessage.value = "";
        // inputFile.value = "";
    };
    useEffect(() => {
        socket.on("sentMsg", (data) =>
            setMessages((prev) => [
                ...prev,
                { sentOrReceived: "Sent", msg: data },
            ])
        );
        socket.on("receivedMsg", (data) => {
            setMessages((prev) => [
                ...prev,
                { sentOrReceived: "Received", msg: data },
            ]);
        });
        socket.on("receivedFile", (file) => {
            if (file) {
                const msgContainer = document.getElementById("msg-container");
                const fileContainer = document.createElement("div");
                fileContainer.classList.remove("sent-msg");
                fileContainer.classList.add("received-msg");
                msgContainer.appendChild(fileContainer);
                const fileType = file.split(";")[0].split(":")[1];
                if (fileType.startsWith("image")) {
                    const image = new Image();
                    image.src = file;
                    fileContainer.appendChild(image);
                } else if (fileType.startsWith("audio")) {
                    const audio = new Audio(file);
                    audio.controls = true;
                    fileContainer.appendChild(audio);
                } else if (fileType.startsWith("video")) {
                    const video = document.createElement("video");
                    video.src = file;
                    video.controls = true;
                    fileContainer.appendChild(video);
                } else if (fileType.startsWith("application/pdf")) {
                    const pdfEmbed = document.createElement("embed");
                    pdfEmbed.src = file;
                    pdfEmbed.type = "application/pdf";
                    pdfEmbed.width = "100%";
                    pdfEmbed.height = "600";
                    fileContainer.appendChild(pdfEmbed);
                } else {
                    const downloadLink = document.createElement("a");
                    downloadLink.href = file;
                    downloadLink.download = "file";
                    downloadLink.textContent = "Download File";
                    fileContainer.appendChild(downloadLink);
                }
            }
        });
        socket.on("sentFile", (file) => {
            if (file) {
                const msgContainer = document.getElementById("msg-container");
                const fileContainer = document.createElement("div");

                fileContainer.classList.remove("received-msg");
                fileContainer.classList.add("sent-msg");
                msgContainer.appendChild(fileContainer);
                const fileType = file.split(";")[0].split(":")[1];
                if (fileType.startsWith("image")) {
                    const image = new Image();
                    image.src = file;
                    fileContainer.appendChild(image);
                } else if (fileType.startsWith("audio")) {
                    const audio = new Audio(file);
                    audio.controls = true;
                    fileContainer.appendChild(audio);
                } else if (fileType.startsWith("video")) {
                    const video = document.createElement("video");
                    video.src = file;
                    video.controls = true;
                    fileContainer.appendChild(video);
                } else if (fileType.startsWith("application/pdf")) {
                    const pdfEmbed = document.createElement("embed");
                    pdfEmbed.src = file;
                    pdfEmbed.type = "application/pdf";
                    pdfEmbed.width = "100%";
                    pdfEmbed.height = "600";
                    fileContainer.appendChild(pdfEmbed);
                } else {
                    const downloadLink = document.createElement("a");
                    downloadLink.href = file;
                    downloadLink.download = "file";
                    downloadLink.textContent = "Download File";
                    fileContainer.appendChild(downloadLink);
                }
            }
        });

        return () => {
            // socket.off("sentMsg");
            // socket.off("receivedMsg");
        };
    }, []);
    return (
        <div className="msg-container" id="msg-container">
            {messages?.map((message, id) => (
                <div key={id}>
                    {" "}
                    <li
                        className={
                            message.sentOrReceived == "Sent"
                                ? "sent-msg message"
                                : "received-msg message"
                        }
                    >
                        {message.msg}
                    </li>
                </div>
            ))}
            <form
                className="send-form"
                onSubmit={(e) => sendMessage(e)}
                id="send-form"
            >
                <input
                    id="msg-input"
                    type="text"
                    name="msg"
                    autoComplete="off"
                    ref={inputRef}
                />
                <input ref={inputFileRef} type="file" id="file-upload" />
                <button type="submit" className="send-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Chat;
