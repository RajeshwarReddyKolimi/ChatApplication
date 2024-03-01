import React, { useContext, useRef, useState } from "react";
import "../../styles/form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoaderContext, UserContext } from "../../App";
import url from "../../backendURL";
import Loader from "../Utils/Loader";
function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const passwordRef = useRef();
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState({});
    const handleShowPassword = (e) => {
        e.preventDefault();
        passwordRef.current.type = showPassword ? "text" : "password";
        setShowPassword((pr) => !pr);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { username, fullname, gender, password } = formData;
            if (!username || username == "") {
                setError("Username is required");
                return;
            }
            if (!fullname || fullname == "") {
                setError("Fullname is required");
                return;
            }
            if (!gender || gender == "") {
                setError("Gender is required");
                return;
            }

            if (!password || password == "") {
                setError("Password is required");
                return;
            }
            if (username.length < 4) {
                setError("Username must be atleast 4 characters");
                return;
            }
            if (fullname.length < 4) {
                setError("Fullname must be atleast 4 characters");
                return;
            }
            const passwordRegex =
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

            if (password.length < 8 || !passwordRegex.test(password)) {
                setError(
                    `Must be atleast 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`
                );
                return;
            }

            setError();
            setLoading(true);
            const endpoint = `${url}/api/user/register`;
            const res = await axios.post(`${endpoint}`, formData, {
                withCredentials: true,
            });
            const data = await res.data;
            if (data.user) setUser(data);
            else setError(data.error);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };
    if (user) return <Navigate to={`/dashboard`} replace />;
    return (
        <div className="form-container">
            <form className="form" onSubmit={(e) => handleRegister(e)}>
                <h2>Signup</h2>
                <div className="form-item">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="username"
                        name="username"
                        onChange={(e) =>
                            setFormData((prev) => {
                                return {
                                    ...prev,
                                    username: e.target.value,
                                };
                            })
                        }
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="fullname" className="form-label">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="fullname"
                        name="fullname"
                        onChange={(e) =>
                            setFormData((prev) => {
                                return {
                                    ...prev,
                                    fullname: e.target.value,
                                };
                            })
                        }
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="gender" className="form-label">
                        Gender
                    </label>
                    <select
                        className="form-input"
                        placeholder="gender"
                        name="gender"
                        onChange={(e) =>
                            setFormData((prev) => {
                                return { ...prev, gender: e.target.value };
                            })
                        }
                    >
                        <option value="" default>
                            Select
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
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
                            name="password"
                            onChange={(e) =>
                                setFormData((prev) => {
                                    return {
                                        ...prev,
                                        password: e.target.value,
                                    };
                                })
                            }
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
                        Signup
                    </button>
                )}
                <div className="login-info">
                    Already have an Account? <Link to="/login">Login</Link>{" "}
                </div>
            </form>
        </div>
    );
}
export default Register;
