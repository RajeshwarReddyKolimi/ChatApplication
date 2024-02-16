import React, { useRef } from "react";

export default function SearchUser({ setUserSearchInput }) {
    const searchUserRef = useRef();
    const handleSearchUser = async () => {
        const inp = searchUserRef.current.value;
        console.log(inp);
        setUserSearchInput(inp);
    };
    return (
        <div className="search-user-container">
            <input
                className="search-user-input"
                ref={searchUserRef}
                type="text"
                placeholder="Search Users..."
                onChange={() => handleSearchUser()}
            />
        </div>
    );
}
