import React, { useContext, useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import User from "./User";

function SearchUsersList({ loading, users }) {
    return (
        <div className="users-list">
            {loading && <Loader />}
            {users?.map((u, id) => (
                <User user={u} />
            ))}
        </div>
    );
}

export default SearchUsersList;
