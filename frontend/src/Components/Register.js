import React, { useRef, useState } from "react";
import "../styles/form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Register() {
    const navigate = useNavigate();

    const passwordRef = useRef();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({});
    const handleShowPassword = (e) => {
        e.preventDefault();
        passwordRef.current.type = showPassword ? "text" : "password";
        setShowPassword((pr) => !pr);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `http://localhost:4000/api/user/register`;
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
        <div className="form-container" onSubmit={(e) => handleRegister(e)}>
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
                <input
                    type="text"
                    className="form-input"
                    placeholder="fullname"
                    onChange={(e) =>
                        setFormData((prev) => {
                            return { ...prev, fullname: e.target.value };
                        })
                    }
                />
                <select
                    className="form-input"
                    placeholder="gender"
                    onChange={(e) =>
                        setFormData((prev) => {
                            return { ...prev, gender: e.target.value };
                        })
                    }
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
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
export default Register;
