import React, { useContext, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import { useParams } from "react-router";
import url from "../backendURL";
import axios from "axios";
import SideBar from "./Sidebar";
import { UserContext } from "../App";
import { io } from "socket.io-client";

function ChatDashboard() {
    const { user } = useContext(UserContext);
    const { id: receiverId } = useParams();
    const [receiver, setReceiver] = useState([]);
    const [socket, setSocket] = useState();
    const [onlineUsers, setOnlineUsers] = useState();
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchReceiverDetails = async () => {
        try {
            setLoading(true);
            const endpoint = `${url}/api/users/${receiverId}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            const data = await res.data;
            setReceiver(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };
    const fetchConversation = async () => {
        try {
            setConversation([]);
            const endpoint = `${url}/api/messages/${receiverId}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            const messages = [];
            for (let i = 0; i < data.length; i++) {
                messages.push({
                    sent: receiverId === data[i]?.receiverId,
                    message: data[i]?.message,
                });
            }
            setConversation(messages);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        if (receiverId) {
            fetchReceiverDetails();
            fetchConversation();
        }
    }, [receiverId]);
    useEffect(() => {
        if (user?._id) {
            const userId = user?._id;
            const socket = io(url, {
                query: {
                    userId,
                },
            });
            setSocket(socket);
            return () => socket.close();
        }
    }, [user]);
    useEffect(() => {
        socket?.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket?.off("getOnlineUsers");
        };
    }, [socket]);
    return (
        <div className="dashboard">
            <div className={receiverId && `hide-side-bar`}>
                <SideBar receiverId={receiverId} onlineUsers={onlineUsers} />
            </div>
            {receiverId && (
                <Chat
                    conversation={conversation}
                    receiver={receiver}
                    receiverId={receiverId}
                    setConversation={setConversation}
                    loading={loading}
                    socket={socket}
                />
            )}
        </div>
    );
}

export default ChatDashboard;
