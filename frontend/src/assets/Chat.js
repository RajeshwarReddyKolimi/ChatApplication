import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import { MdSend, MdArrowBack } from "react-icons/md";
import notification1 from "./notify.mp3";
import Loader from "../Components/Utils/Loader";
import url from "../backendURL";
import Welcome from "../Components/Utils/Welcome";
import { ReceiverContext, SocketContext } from "../Components/Home/Dashboard";
import Messages from "../Components/Chats/Messages";
import { formatDate } from "../Components/formatDate";
function Chat({ loading, conversation, setConversation }) {
    const { socket } = useContext(SocketContext);
    const { receiver } = useContext(ReceiverContext);
    const messageRef = useRef();
    const receiverIdRef = useRef(receiver?._id);
    const handleBack = () => {
        window.history.back();
    };
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
            setConversation((prev) => [
                ...prev,
                { sent: true, message, time: formatDate(new Date()) },
            ]);
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
                    {
                        sent: false,
                        message: message,
                        time: formatDate(new Date()),
                    },
                ]);
            }
        });
        return () => {
            socket?.off("message");
        };
    }, [socket]);

    return (
        <div className="chat-space">
            <div className="receiver">
                <button onClick={handleBack}>
                    <MdArrowBack className="icon-1" />
                </button>
                <img className="receiver-image" src={receiver?.dp} alt="dp" />
                <div className="receiver-name">{receiver?.fullname}</div>
            </div>
            <Messages conversation={conversation} loading={loading} />

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
