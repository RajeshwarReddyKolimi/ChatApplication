import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { MdSend, MdArrowBack } from "react-icons/md";
import notification1 from "../assets/notify2.mp3";
import { io } from "socket.io-client";
import Loader from "./Loader";
import url from "../backendURL";
function Chat({ receiver, user, showChat, setShowChat, socket, setSocket }) {
    const messageRef = useRef();
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        try {
            const endpoint = `${url}/api/messages/${receiver?._id}`;
            const res = await axios.post(
                `${endpoint}`,
                { message },
                {
                    withCredentials: true,
                }
            );
            setConversation((prev) => [...prev, { sent: true, message }]);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchConversation = async () => {
        try {
            setLoading(true);
            const endpoint = `${url}/api/messages/${receiver?._id}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            const messages = [];
            for (let i = 0; i < data.length; i++) {
                messages.push({
                    sent: receiver?._id === data[i]?.receiverId,
                    message: data[i]?.message,
                });
            }
            setLoading(false);
            setConversation(messages);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };

    const handleChatBack = () => {
        setShowChat(false);
    };

    useEffect(() => {
        fetchConversation();
        if (receiver) setShowChat(true);
    }, [receiver]);

    useEffect(() => {
        socket?.on("message", ({ senderId, message }) => {
            console.log(senderId, receiver?._id);
            if (senderId == receiver?._id?.toString()) {
                const sound = new Audio(notification1);
                sound.play();
                setConversation((prev) => [
                    ...prev,
                    { sent: false, message: message },
                ]);
            }
        });
        return () => {
            socket?.off("message");
        };
    }, [socket]);

    const lastMessageRef = useRef();
    useEffect(() => {
        window.addEventListener("popstate", (e) => {
            e.preventDefault();
            setShowChat(false);
        });

        return () => {
            window.removeEventListener("popstate", (e) => {});
        };
    }, []);
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView();
        }, 100);
    }, [conversation]);
    return (
        <div className="chat-space">
            <h1>{showChat}</h1>
            <div className="receiver">
                <button className="chat-back-button" onClick={handleChatBack}>
                    <MdArrowBack className="icon-1" />
                </button>
                <img className="receiver-image" src={receiver?.dp} alt="dp" />
                <div className="receiver-name">{receiver?.fullname}</div>
            </div>
            <div className="message-container" id="message-container">
                {loading && <Loader />}
                {!loading && conversation?.length === 0 && (
                    <div>Start Chat</div>
                )}
                {conversation?.map((conv) => (
                    <div
                        ref={lastMessageRef}
                        className={`message
                                ${
                                    conv?.sent
                                        ? "sent-message"
                                        : "received-message"
                                }`}
                    >
                        <div className="message-text">
                            {conv?.sent} {conv.message}
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-form-container">
                <form
                    className="message-form"
                    onSubmit={(e) => handleSendMessage(e)}
                >
                    <input
                        className="message-input"
                        type="text"
                        ref={messageRef}
                        placeholder="Message"
                    />
                    <button className="send-button" type="submit">
                        <MdSend className="icon-1" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
