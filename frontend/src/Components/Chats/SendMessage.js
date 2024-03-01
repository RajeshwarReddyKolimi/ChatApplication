import React, { useContext, useRef } from "react";
import { ReceiverContext } from "../Home/Dashboard";
import url from "../../backendURL";
import axios from "axios";
import { formatDate } from "../../HelperFunctions/formatDate";
import { MdSend } from "react-icons/md";

export default function SendMessage({ setConversation }) {
    const { receiver } = useContext(ReceiverContext);

    const messageRef = useRef();
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = messageRef.current.value;
        messageRef.current.value = "";
        if (message == "") return;
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
    return (
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
    );
}
