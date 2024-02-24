import React, { useContext, useEffect, useState } from "react";
import { LoaderContext, UserContext } from "../App";
import UsersList from "./UsersList";
import { Navigate } from "react-router";
import Header from "./Header";
import SearchUser from "./SearchUser";
import Loader from "./Loader";

export default function SideBar({ showSearchResult, setShowSearchResult }) {
    const { user } = useContext(UserContext);
    const { loading } = useContext(LoaderContext);

    if (loading) <Loader />;
    else if (!user) return <Navigate to={`/login`} replace />;
    return (
        <div className="side-bar">
            <Header />
            <SearchUser
                showSearchResult={showSearchResult}
                setShowSearchResult={setShowSearchResult}
            />
            <UsersList showSearchResult={showSearchResult} />
        </div>
    );
}
