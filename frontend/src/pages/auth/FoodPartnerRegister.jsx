import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;

    if (password !== confirmPassword) {
      showFlash("Passwords do not match!", "error");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/auth/food-partner/register", {
        name,
        contactName,
        phone,
        address,
        email,
        password,
      });

      showFlash(
        "Registration successful! Check your email to verify before login.",
        "success"
      );

      navigate("/verify-pending"); // ✅ same UX page
    } catch {
      showFlash("Registration failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>Food Partner Registration</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" name="name" required />
          </div>

          <div className="form-group">
            <label>Contact Name</label>
            <input type="text" name="contactName" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="number" name="phone" required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" required />
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
          <Link to="/food-partner/login">Already have an account? Login</Link>
        </div>
        <div className="link">
          <Link to="/user/register">Register as User</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
