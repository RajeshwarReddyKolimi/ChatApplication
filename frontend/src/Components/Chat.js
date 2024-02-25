import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import { MdSend, MdArrowBack } from "react-icons/md";
import notification1 from "../assets/notify.mp3";
import Loader from "./Loader";
import url from "../backendURL";
import Welcome from "./Welcome";
import { ReceiverContext, SocketContext } from "./ChatDashboard";
function Chat({ loading, conversation, setConversation }) {
    const { socket } = useContext(SocketContext);
    const { receiver } = useContext(ReceiverContext);
    const messageRef = useRef();
    const receiverIdRef = useRef(receiver?._id);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        try {
            if (!receiver?._id) return;
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
    };

    useEffect(() => {
        receiverIdRef.current = receiver?._id;
    }, [receiver]);
    useEffect(() => {
        socket?.on("message", ({ senderId, message }) => {
            const currentReceiverId = receiverIdRef.current;
            if (senderId == currentReceiverId) {
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
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView();
        }, 100);
    }, [conversation]);
    return (
        <div className="chat-space">
            <div className="receiver">
                <img className="receiver-image" src={receiver?.dp} alt="dp" />
                <div className="receiver-name">{receiver?.fullname}</div>
            </div>
            <div className="message-container" id="message-container">
                {loading && <Loader />}
                {!loading && conversation?.length === 0 && (
                    <Welcome msg="Say Hello!" />
                )}
                {conversation?.map((conv) => (
                    <div
                        key={conv?._id}
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
