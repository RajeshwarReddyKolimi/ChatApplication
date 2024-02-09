import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import "../styles/dashboard.css";
import Users from "./Users";
import { io } from "socket.io-client";

export default function Dashboard() {
    const [socket, setSocket] = useState();
    const { userId } = useParams();
    useEffect(() => {
        if (userId) {
            const socket = io("http://localhost:4000", {
                query: {
                    userId,
                },
            });
            setSocket(socket);
        }
    }, []);

    return (
        <div className="dashboard-page">
            <Users socket={socket} />
        </div>
    );
}
