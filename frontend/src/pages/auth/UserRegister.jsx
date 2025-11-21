import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";

const UserRegister = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;

    if (password !== confirmPassword) {
      showFlash("Passwords do not match!", "error");
      return;
    }

    try {
      setLoading(true);

     const response = await axios.post("/auth/user/register", {
        fullName,
        email,
        password,
      });
      
      const msg = response.data.message || "Registration successful! Check your email to verify.";
      const type = response.data.type || "success";
      showFlash(msg, type);
      navigate("/verify-pending"); 
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      const type = err.response?.data?.type || "error";
      showFlash(msg, type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>User Registration</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="***********"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="***********"
              required
            />
          </div>

          <button disabled={loading} type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
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
