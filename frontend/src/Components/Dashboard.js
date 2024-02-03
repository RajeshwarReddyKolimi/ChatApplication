import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { socket } from "../socket";

export default function Dashboard() {
    const [username, setUsername] = useState();
    const [users, setUsers] = useState([]);
    const url = `http://localhost:3000`;
    const endpoint = `users/${username}`;
    const fetchUsers = async (user) => {
        try {
            const res = await axios.get(`${url}/users/${user}`);
            let data = await res.data;
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        const promptUsername = prompt("Enter Username");
        setUsername(promptUsername);
        socket.connect();
        socket.emit("username", promptUsername);
        fetchUsers(promptUsername);
    }, []);

    return (
        <div className="users">
            {users?.map((user, id) => (
                <Link
                    to={`/${username}/${user.username}`}
                    key={user?.username}
                    className="username"
                >
                    {user?.username}
                </Link>
            ))}
        </div>
    );
}
