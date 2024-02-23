import React from "react";
import { Link } from "react-router-dom";

export default function User({ user, onlineUsers, receiverId }) {
    console.log("User", user);
    return (
        <Link
            to={`/chat/${user?._id}`}
            replace={receiverId ? true : false}
            key={user?.username}
            className={`${
                receiverId == user?._id.toString()
                    ? "selected-user users-list-item"
                    : "users-list-item"
            }
            ${onlineUsers?.includes(user?._id) && "online-user"}
            `}
        >
            <img
                src={user.dp}
                alt="dp"
                className={`profile-picture ${
                    onlineUsers?.includes(user?._id) && "online-user"
                }`}
            />

            <div className="fullname">{user?.fullname}</div>
        </Link>
    );
}
