import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Chat from "./Components/Chat";
import Register from "./Components/Register";
import Login from "./Components/Login";

function App() {
    return (
        <div className="App">
            {/* Hello */}
            <BrowserRouter>
                <Routes>
                    <Route index element={<Register />} />
                    <Route path="/user/register" element={<Register />} />
                    <Route path="/user/login" element={<Login />} />
                    <Route
                        path="/user/dashboard/:userId"
                        element={<Dashboard />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
