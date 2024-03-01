import React, { useContext } from "react";
import { UserContext } from "../../App";
import { Navigate } from "react-router";

function Settings() {
    const { user, setUser } = useContext(UserContext);
    if (!user) return <Navigate to={`/user/login`} replace />;
    return <div></div>;
}

export default Settings;
