import React, { useContext, useEffect, useRef, useState } from "react";
import Loader from "../Utils/Loader";
import { UserContext } from "../../App";
import User from "./User";
import { AllUsersContext, SearchUsersContext } from "../Home/Dashboard";

function UsersList({ usersLoading, showSearchResult }) {
    const { users } = useContext(AllUsersContext);
    const { searchUsers } = useContext(SearchUsersContext);
    return (
        <div className="users-list">
            {usersLoading && <Loader />}
            {showSearchResult
                ? searchUsers?.map((u, id) => <User user={u} key={u._id} />)
                : users?.map((u, id) => <User user={u} key={u._id} />)}
        </div>
    );
}

export default UsersList;
