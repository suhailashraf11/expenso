import { useState } from "react";
import "./Signup.css";

function Signup({ onShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Signup response:", data);

      if (response.ok) {
        alert("Signup successful. You can now login.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create Account</h1>

        <p className="subtitle">Create your Expense Tracker account</p>

        <form className="signup-form" onSubmit={handleSignup}>
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="signup-button" type="submit">
            Create Account
          </button>
          <p className="login-link">
            Already have an account?{" "}
            <button type="button" onClick={onShowLogin}>
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
