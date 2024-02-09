import React, { useEffect, useRef } from "react";
import "../styles/dashboard.css";
import axios from "axios";
import { MdSend } from "react-icons/md";
function Chat({ conversation, receiver, socket, setConversation }) {
    const messageRef = useRef();
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        try {
            const endpoint = `http://localhost:4000/api/messages/${receiver?._id}`;
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
        socket?.on("message", (msg) => {
            console.log("Message listening", msg);
            setConversation((prev) => [...prev, { sent: false, message: msg }]);
        });
        return () => {
            socket?.off("message");
        };
    }, [socket]);
    return (
        <div className="chat-space">
            <div className="receiver">
                <img className="receiver-image" src={receiver?.dp} alt="dp" />
                <div className="receiver-name">{receiver?.fullname}</div>
            </div>
            <div className="message-container">
                {conversation?.map((conv) => (
                    <div
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
            <form
                className="message-form"
                onSubmit={(e) => handleSendMessage(e)}
            >
                <input className="form-input" type="text" ref={messageRef} />
                <button className="submit-button" type="submit">
                    <MdSend />
                </button>
            </form>
        </div>
    );
}

export default Chat;
