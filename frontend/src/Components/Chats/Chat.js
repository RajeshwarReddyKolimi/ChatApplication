import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import { MdSend, MdArrowBack } from "react-icons/md";
import notification1 from "../../Assets/notify.mp3";
import Loader from "../Utils/Loader";
import url from "../../backendURL";
import Welcome from "../Utils/Welcome";
import { ReceiverContext, SocketContext } from "../Home/Dashboard";
import Messages from "./Messages";
import { formatDate } from "../../HelperFunctions/formatDate";
import SendMessage from "./SendMessage";
function Chat({ chatLoading, conversation, setConversation }) {
    const { socket } = useContext(SocketContext);
    const { receiver } = useContext(ReceiverContext);
    const receiverIdRef = useRef(receiver?._id);
    const handleBack = () => {
        window.history.back();
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
            <Messages conversation={conversation} chatLoading={chatLoading} />

            <SendMessage setConversation={setConversation} />
        </div>
    );
}

export default Chat;
