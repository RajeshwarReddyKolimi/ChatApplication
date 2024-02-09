import axios from "axios";
import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import "../styles/dashboard.css";
import Welcome from "./Welcome";

function Users({ socket }) {
    const [users, setUsers] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [receiver, setReceiver] = useState();
    const fetchUsers = async () => {
        try {
            const endpoint = `http://localhost:4000/api/users`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            if (data) setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchConversation = async (receiverId) => {
        try {
            const endpoint = `http://localhost:4000/api/messages/${receiverId}`;
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
        fetchUsers();
    }, []);
    return (
        <div className="dashboard">
            <div className="users-list">
                {users?.map((user, id) => (
                    <button
                        key={user?.fullname}
                        className="users-list-item"
                        onClick={() => {
                            setReceiver(user);
                            fetchConversation(user?._id);
                        }}
                    >
                        <img
                            src={user.dp}
                            alt="dp"
                            className="profile-picture"
                        />{" "}
                        <div className="fullname">{user?.fullname}</div>
                    </button>
                ))}
            </div>
            {receiver ? (
                <Chat
                    conversation={conversation}
                    setConversation={setConversation}
                    receiver={receiver}
                    socket={socket}
                />
            ) : (
                <Welcome />
            )}
        </div>
    );
}

export default Users;
