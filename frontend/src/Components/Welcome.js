import React from "react";

function Welcome({ msg }) {
    const welcomeContainer = {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
    };
    return (
        <div className="welcome-container" style={welcomeContainer}>
            <h3 className="welcome-message">{msg ? msg : "Hello!"}</h3>
        </div>
    );
}

export default Welcome;
