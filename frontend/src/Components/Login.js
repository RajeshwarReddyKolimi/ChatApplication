import React, { useRef, useState } from "react";
import "../styles/form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    const passwordRef = useRef();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({});
    const handleShowPassword = (e) => {
        e.preventDefault();
        passwordRef.current.type = showPassword ? "text" : "password";
        setShowPassword((pr) => !pr);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `http://localhost:4000/api/user/login`;
            const res = await axios.post(`${endpoint}`, formData, {
                withCredentials: true,
            });
            const data = await res.data;

            navigate(`/user/dashboard/${data?._id}`);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="form-container" onSubmit={(e) => handleLogin(e)}>
            <Link to="/user/login">Login</Link>
            <Link to="/user/register">Register</Link>
            <Link to="/user/dashboard">Dashboard</Link>
            <form className="form">
                <input
                    type="text"
                    className="form-input"
                    placeholder="username"
                    onChange={(e) =>
                        setFormData((prev) => {
                            return { ...prev, username: e.target.value };
                        })
                    }
                />

                <div className="password-container">
                    <input
                        type="password"
                        className="form-input password"
                        ref={passwordRef}
                        placeholder="password"
                        onChange={(e) =>
                            setFormData((prev) => {
                                return { ...prev, password: e.target.value };
                            })
                        }
                    />
                    <button
                        className="view-password"
                        onClick={(e) => handleShowPassword(e)}
                    >
                        {showPassword ? (
                            <FaEye className="icon-1" />
                        ) : (
                            <FaEyeSlash className="icon-1" />
                        )}
                    </button>
                </div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Login;
