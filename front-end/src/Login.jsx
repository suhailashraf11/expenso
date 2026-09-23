import { useState } from "react";
import "./Login.css";

function Login({ onLoginSuccess, onShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);

        console.log("Token saved successfully");

        onLoginSuccess();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p className="subtitle">Login to your Expense Tracker</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="login-button" type="submit">
            Login
          </button>
          <p className="signup-link">
            Don't have an account?{" "}
            <button type="button" onClick={onShowSignup}>
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
