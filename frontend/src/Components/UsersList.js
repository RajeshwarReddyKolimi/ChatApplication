import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../backendURL";
import Loader from "./Loader";

function UsersList({
    userSearchInput,
    receiver,
    setReceiver,
    setShowChat,
    onlineUsers,
}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState([]);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const endpoint = `${url}/api/users/search?q=${userSearchInput}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            if (data) setUsers(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [userSearchInput]);
    return (
        <div className="dashboard">
            <div className="users-list">
                {loading && <Loader />}
                {!loading && users?.length === 0 && <div>No Users Found</div>}
                {users?.map((user, id) => (
                    <button
                        key={user?.username}
                        className={`
                            ${
                                receiver === user
                                    ? "selected-user users-list-item"
                                    : "users-list-item"
                            }
                            `}
                        onClick={() => {
                            setReceiver();
                            setShowChat(true);
                            setReceiver(user);
                        }}
                    >
                        <div
                            className={`${
                                onlineUsers.includes(user?._id) && "online-user"
                            }`}
                        >
                            <img
                                src={user.dp}
                                alt="dp"
                                className={`profile-picture ${
                                    onlineUsers.includes(user?._id) &&
                                    "online-user"
                                }`}
                            />
                        </div>
                        <div className="fullname">{user?.fullname}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default UsersList;
