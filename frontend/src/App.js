import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Home/Dashboard";
import Register from "./Components/Authentication/Register";
import Login from "./Components/Authentication/Login";
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
            if (data) setUser(data);
        } catch (e) {}
    };
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
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/chat/:id" element={<Dashboard />} />
                        </Routes>
                    </BrowserRouter>
                </LoaderContext.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default App;
