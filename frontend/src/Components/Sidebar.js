import React, { useContext, useEffect, useState } from "react";
import { LoaderContext, UserContext } from "../App";
import UsersList from "./UsersList";
import { Navigate } from "react-router";
import Header from "./Header";
import SearchUser from "./SearchUser";
import { io } from "socket.io-client";
import url from "../backendURL";
import Loader from "./Loader";

export default function SideBar({ receiverId, onlineUsers }) {
    const { user, setUser } = useContext(UserContext);
    const { loading } = useContext(LoaderContext);
    const [receiver, setReceiver] = useState();
    const [userSearchInput, setUserSearchInput] = useState("");

    if (loading) <Loader />;
    else if (!user) return <Navigate to={`/login`} replace />;
    return (
        <div className="side-bar">
            <Header />
            <SearchUser setUserSearchInput={setUserSearchInput} />
            <UsersList
                user={user}
                userSearchInput={userSearchInput}
                onlineUsers={onlineUsers}
                receiverId={receiverId}
            />
        </div>
    );
}
