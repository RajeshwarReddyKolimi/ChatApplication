import React, { useContext, useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { UserContext } from "../App";
import User from "./User";
import { AllUsersContext, SearchUsersContext } from "./ChatDashboard";

function UsersList({ loading, showSearchResult }) {
    const { users } = useContext(AllUsersContext);
    const { searchUsers } = useContext(SearchUsersContext);
    return (
        <div className="users-list">
            {loading && <Loader />}
            {showSearchResult
                ? searchUsers?.map((u, id) => <User user={u} />)
                : users?.map((u, id) => <User user={u} />)}
        </div>
    );
}

export default UsersList;
