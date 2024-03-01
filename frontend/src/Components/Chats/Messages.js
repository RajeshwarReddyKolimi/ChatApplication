import React, { useEffect, useRef } from "react";
import Loader from "../Utils/Loader";
import Welcome from "../Utils/Welcome";

function Messages({ conversation, chatLoading }) {
    const lastMessageRef = useRef();

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);
    return (
        <div className="message-container">
            {chatLoading && <Loader />}

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
                    <div className="message-item">
                        <div className="message-text">
                            {conv?.sent} {conv.message}
                        </div>
                        <div className="message-time">{conv?.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Messages;
