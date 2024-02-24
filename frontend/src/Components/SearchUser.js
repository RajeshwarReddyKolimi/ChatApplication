import React, { useContext, useEffect, useRef, useState } from "react";
import url from "../backendURL";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { UserContext } from "../App";
import { SearchUsersContext } from "./ChatDashboard";

export default function SearchUser({ showSearchResult, setShowSearchResult }) {
    const { user } = useContext(UserContext);
    const { searchUsers, setSearchUsers } = useContext(SearchUsersContext);
    const searchUserRef = useRef();
    const [showHideButton, setShowHideButton] = useState(false);
    const handleSearchUser = async () => {
        const inp = searchUserRef.current.value;
        try {
            const endpoint = `${url}/api/users/search?q=${inp}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            if (data) setSearchUsers(data);
        } catch (e) {
            console.error(e);
        }
    };
    console.log("searchUsers", searchUsers);
    const handleFocus = () => {
        setShowSearchResult(true);
        setShowHideButton(true);
    };

    const hideSearchResult = () => {
        searchUserRef.current.value = "";
        setShowSearchResult(false);
        setShowHideButton(false);
    };

    useEffect(() => {
        const element = searchUserRef.current;
        if (element) {
            element.addEventListener("focus", handleFocus);
            return () => {
                element.removeEventListener("focus", handleFocus);
            };
        }
    }, []);
    return (
        <div className="search-user-container">
            <div className="search-user-form">
                <input
                    className="search-user-input"
                    ref={searchUserRef}
                    type="text"
                    placeholder="Search Users..."
                    onChange={() => handleSearchUser()}
                />
                {showHideButton && (
                    <div
                        onClick={hideSearchResult}
                        className="hide-search-result-button"
                    >
                        <MdClose className="icon-1" />
                    </div>
                )}
            </div>
        </div>
    );
}
