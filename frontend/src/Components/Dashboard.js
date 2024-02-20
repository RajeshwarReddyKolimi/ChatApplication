import React, { useContext, useEffect, useState } from "react";

import Chat from "./Chat";
import Welcome from "./Welcome";
import Settings from "./Settings";
import { UserContext } from "../App";
import UsersList from "./UsersList";
import { Navigate } from "react-router";
import Header from "./Header";
import SearchUser from "./SearchUser";
import { io } from "socket.io-client";
import url from "../backendURL";

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const [receiver, setReceiver] = useState();
    const [userSearchInput, setUserSearchInput] = useState("");
    const [selectedUser, setSelectedUser] = useState();
    const [showChat, setShowChat] = useState(false);
    const [screenSize, setScreenSize] = useState(window.screen.width >= 768);
    const [socket, setSocket] = useState();
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setScreenSize(window.screen.innerWidth >= 768);
        });
        return () => {
            window.removeEventListener("resize", () => {});
        };
    }, []);
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
            console.log(users);
            setOnlineUsers(users);
        });

        return () => {
            socket?.off("getOnlineUsers");
        };
    }, [socket]);
    if (!user) return <Navigate to={`/user/login`} replace />;
    return (
        <div className="dashboard">
            {(showChat == false || screenSize) && (
                <div className="side-bar">
                    <Header />
                    <SearchUser setUserSearchInput={setUserSearchInput} />
                    <UsersList
                        user={user}
                        setReceiver={setReceiver}
                        userSearchInput={userSearchInput}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                        setShowChat={setShowChat}
                        onlineUsers={onlineUsers}
                    />
                </div>
            )}
            {(showChat || screenSize) && (
                <div className="chat-container">
                    {receiver ? (
                        <Chat
                            user={user}
                            receiver={receiver}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            socket={socket}
                            setSocket={setSocket}
                        />
                    ) : (
                        <Welcome />
                    )}
                </div>
            )}
        </div>
    );
}
