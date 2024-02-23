import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import url from "../backendURL";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import User from "./User";

function UsersList({ userSearchInput, receiverId, onlineUsers }) {
    const { user: currentUser } = useContext(UserContext);
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
                {users?.map((u, id) => (
                    <User
                        receiverId={receiverId}
                        user={
                            currentUser === u.participants[0]
                                ? u.participants[0]
                                : u.participants[1]
                        }
                        onlineUsers={onlineUsers}
                    />
                ))}
            </div>
        </div>
    );
}

export default UsersList;
