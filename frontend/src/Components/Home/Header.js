import React, { useContext } from "react";
import { LoaderContext, UserContext } from "../../App";
import { BiLogOut } from "react-icons/bi";
import url from "../../backendURL";
import axios from "axios";
import { Link } from "react-router-dom";

function Header() {
    const { user, setUser } = useContext(UserContext);
    const logout = async () => {
        try {
            const endpoint = `${url}/api/user/logout`;
            const res = await axios.post(
                `${endpoint}`,
                {},
                {
                    withCredentials: true,
                }
            );
            let data = await res.data;
            setUser();
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <div className="header">
            <Link className="logo" to="/">
                ChitChat
            </Link>
            <button className="logout" onClick={logout}>
                <BiLogOut className="icon-1" />
            </button>
        </div>
    );
}

export default Header;
