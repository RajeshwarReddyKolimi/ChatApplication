import React from "react";
import SideBar from "./Sidebar";
import Welcome from "./Welcome";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <SideBar />
            <Welcome />
        </div>
    );
}
