import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Chat from "./Components/Chat";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/:username/:friend" element={<Chat />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
