import React, { useContext, useEffect, useState } from "react";

import Chat from "./Chat";
import Welcome from "./Welcome";
import Settings from "./Settings";
import { UserContext } from "../App";
import UsersList from "./UsersList";
import { Navigate } from "react-router";
import Header from "./Header";
import SearchUser from "./SearchUser";

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const [receiver, setReceiver] = useState();
    const [userSearchInput, setUserSearchInput] = useState("");
    const [selectedUser, setSelectedUser] = useState();
    if (!user) return <Navigate to={`/user/login`} replace />;
    return (
        <div className="dashboard">
            <div className="side-bar">
                <Header />
                <SearchUser setUserSearchInput={setUserSearchInput} />
                <UsersList
                    user={user}
                    setReceiver={setReceiver}
                    userSearchInput={userSearchInput}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                />
            </div>
            <div className="chat-container">
                {receiver ? (
                    <Chat user={user} receiver={receiver} />
                ) : (
                    <Welcome />
                )}
            </div>
        </div>
    );
}
