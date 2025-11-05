import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";
const UserRegister = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      showFlash("Passwords do not match!", "error");
      return;
    }

    try {
      await axios.post("/auth/user/register", { fullName, email, password });
      navigate("/");
    } catch {
      showFlash("User Registration error! Try again.", "error");
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>User Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="* * * * * * * * * * * *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="* * * * * * * * * * * *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>

        <div className="link">
          <Link to="/user/login">Already have an account? Login</Link>
        </div>
        <div className="link">
          <Link to="/food-partner/register">Register as Food Partner</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
