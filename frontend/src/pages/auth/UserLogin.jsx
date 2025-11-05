import React from "react";
import axios from "../../utils/axiosInstance";
import { useFlash } from "../../context/FlashContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/user/UserLogin.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post("/auth/user/login", { email, password });
      showFlash("Logged in successfully", "success");
      navigate("/");
    } catch {
      showFlash("User Login error! Try again.", "error");
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>User Login</h1>
        {/* i have added autoComplete to improve form submition and improves UX and accessibility, inspired from CONSOLE SUGGESION */}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="* * * * * * * * * * * *"
            />
          </div>

          <button type="submit">Login</button>
        </form>
        <div className="link">
          <Link to="/user/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
