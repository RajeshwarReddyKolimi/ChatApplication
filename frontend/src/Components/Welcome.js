import React from "react";

function Welcome() {
    const welcomeContainer = {
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    return (
        <div className="welcome-container" style={welcomeContainer}>
            <h3 className="welcome-message">Hello!</h3>
        </div>
    );
}

export default Welcome;
