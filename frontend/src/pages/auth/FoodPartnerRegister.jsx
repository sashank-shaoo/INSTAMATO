import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { showFlash } = useFlash();
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await axios.post("/auth/food-partner/register", {
        name,
        contactName,
        phone,
        address,
        email,
        password,
      });
      if (password !== confirmPassword) {
        showFlash("Passwords do not match!", "error");
        return;
      }
      navigate("/create-food");
    } catch {
      showFlash("Food Partner Registration error! Try again.", "error");
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>Food Partner Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Business Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="contactName">Contact Name</label>
            <input type="text" id="contactName" name="contactName" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="number" id="phone" name="phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" required />
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
          <Link to="/food-partner/login">Already have an account? Login</Link>
        </div>
        <div className="link">
          <Link to="/user/register">Register as Normal User</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
