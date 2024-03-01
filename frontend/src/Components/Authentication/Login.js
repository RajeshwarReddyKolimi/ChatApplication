import React, { useContext, useRef, useState } from "react";
import "../../styles/form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { LoaderContext, UserContext } from "../../App";
import url from "../../backendURL";
import Loader from "../Utils/Loader";
function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const { user, setUser } = useContext(UserContext);
    const passwordRef = useRef();
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState({});
    const handleShowPassword = (e) => {
        e.preventDefault();
        passwordRef.current.type = showPassword ? "text" : "password";
        setShowPassword((pr) => !pr);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { username, password } = formData;
            if (!username || username == "") {
                setError("Username is required");
                return;
            }
            if (!password || password == "") {
                setError("Password is required");
                return;
            }
            setError();
            setLoading(true);
            const endpoint = `${url}/api/user/login`;
            const res = await axios.post(`${endpoint}`, formData, {
                withCredentials: true,
            });
            const data = await res.data;
            if (data.user) setUser(data);
            else setError(data.error);
        } catch (e) {}
        setLoading(false);
    };
    console.log(error);
    if (user) return <Navigate to={`/dashboard`} replace />;
    return (
        <div className="form-container">
            <form className="form" onSubmit={(e) => handleLogin(e)}>
                <h2>Login</h2>
                <div className="form-item">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="username"
                        name="username"
                        onChange={(e) => {
                            setFormData((prev) => {
                                return {
                                    ...prev,
                                    username: e.target.value,
                                };
                            });
                            setError();
                        }}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className="password-container">
                        <input
                            type="password"
                            className="form-input password"
                            ref={passwordRef}
                            placeholder="password"
                            onChange={(e) => {
                                setFormData((prev) => {
                                    return {
                                        ...prev,
                                        password: e.target.value,
                                    };
                                });
                                setError();
                            }}
                        />
                        <div
                            className="view-password"
                            onClick={(e) => handleShowPassword(e)}
                        >
                            {showPassword ? (
                                <FaEye className="icon-1" />
                            ) : (
                                <FaEyeSlash className="icon-1" />
                            )}
                        </div>
                    </div>
                </div>

                {error && <div className="login-error">{error}</div>}
                {loading ? (
                    <Loader />
                ) : (
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                )}
                <div className="login-info">
                    Don't have an Account? <Link to="/register">Register</Link>{" "}
                </div>
            </form>
        </div>
    );
}

export default Login;
