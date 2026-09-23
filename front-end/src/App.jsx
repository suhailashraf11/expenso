import { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [showSignup, setShowSignup] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    if (isLoggedIn) {
        return (
            <Dashboard onLogout={handleLogout} />
        );
    }

    return (
        <div>
            {!showSignup ? (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onShowSignup={() => setShowSignup(true)}
                />
            ) : (
                <Signup
                    onShowLogin={() => setShowSignup(false)}
                />
            )}
        </div>
    );
}

export default App;