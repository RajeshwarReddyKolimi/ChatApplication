import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Chat from "./Components/Chat";
import Register from "./Components/Register";
import Login from "./Components/Login";
import axios from "axios";
import url from "./backendURL";

export const UserContext = createContext();
export const LoaderContext = createContext();
function App() {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const fetchUser = async () => {
        try {
            // setLoading(true);
            const endpoint = `${url}/api/user`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            const data = await res.data;
            console.log(data);
            if (data) setUser(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
        setLoading(false);
    };
    console.log(loading);
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <div className="App">
            <UserContext.Provider value={{ user, setUser }}>
                <LoaderContext.Provider value={{ loading }}>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<Register />} />
                            <Route
                                path="/user/register"
                                element={<Register />}
                            />
                            <Route path="/user/login" element={<Login />} />
                            <Route
                                path="/user/dashboard"
                                element={<Dashboard />}
                            />
                        </Routes>
                    </BrowserRouter>
                </LoaderContext.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default App;
