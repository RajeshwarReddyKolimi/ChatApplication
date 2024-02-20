import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Chat from "./Components/Chat";
import Register from "./Components/Register";
import Login from "./Components/Login";
import { createContext, useState } from "react";

export const UserContext = createContext();
function App() {
    const [user, setUser] = useState();
    return (
        <div className="App">
            <UserContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Register />} />
                        <Route path="/user/register" element={<Register />} />
                        <Route path="/user/login" element={<Login />} />
                        <Route path="/user/dashboard" element={<Dashboard />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}

export default App;
