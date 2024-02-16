import React, { useContext } from "react";
import { UserContext } from "../App";
import { BiLogOut } from "react-icons/bi";

function Header() {
    const { user, setUser } = useContext(UserContext);
    return (
        <div className="header">
            <h1>ChitChat</h1>
            <button className="logout" onClick={() => setUser()}>
                <BiLogOut className="icon-1" />
            </button>
        </div>
    );
}

export default Header;
