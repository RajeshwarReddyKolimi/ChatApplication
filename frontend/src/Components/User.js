import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { OnlineUserContext, ReceiverContext } from "./ChatDashboard";

export default function User({ user }) {
    const { receiver } = useContext(ReceiverContext);
    const { onlineUsers } = useContext(OnlineUserContext);
    return (
        <Link
            to={`/chat/${user?._id}`}
            replace={receiver?._id ? true : false}
            key={user?.fullname}
            className={`${
                receiver?._id == user?._id.toString()
                    ? "selected-user users-list-item"
                    : "users-list-item"
            }
            `}
        >
            <div
                className={`
            ${onlineUsers?.includes(user?._id) && "online-user"}`}
            >
                <img
                    src={user.dp}
                    alt="dp"
                    className={`profile-picture ${
                        onlineUsers?.includes(user?._id) && "online-user"
                    }`}
                />
            </div>

            <div className="fullname">{user?.username}</div>
        </Link>
    );
}
