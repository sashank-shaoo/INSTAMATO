import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";

const FoodPartnerLogin = () => {
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = e.target.password.value;

    if (!email || !password) {
      showFlash("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/auth/food-partner/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // ✅ Clear other role data
      localStorage.removeItem("user");

      // ✅ Save token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // ✅ Save partner data
      if (response.data.foodPartner) {
        localStorage.setItem(
          "foodPartner",
          JSON.stringify(response.data.foodPartner)
        );
      }

      // ✅ Set role
      localStorage.setItem("role", "foodPartner");

      showFlash("Logged in successfully as Food Partner!", "success");
      navigate("/profile");
    } catch (error) {
      console.error("Food Partner login error:", error);

      const msg = error.response?.data?.message;

      // ✅ If backend returns "Email not verified"
      if (error.response?.status === 403 && msg === "Email not verified") {
        showFlash("Your email is not verified. Please verify first.", "error");
        setResendAvailable(true);
      } else {
        showFlash("Invalid email or password", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      showFlash("Enter your email first", "error");
      return;
    }

    try {
      setResendLoading(true);

      await axios.post("/auth/resend-verification", { email });

      showFlash("Verification email sent ✅", "success");
      setResendAvailable(false);
    } catch (error) {
      showFlash("Failed to resend verification email", "error");
      console.log("Resend verification error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>Food Partner Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="* * * * * * * * * * * *"
              autoComplete="current-password"
              required
            />
          </div>

          {/* ✅ Login button with spinner */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Resend button only if email is unverified */}
          {resendAvailable && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendLoading}
              style={{
                marginTop: "10px",
                background: "#ff9900",
                color: "white",
                borderRadius: "6px",
              }}>
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>
          )}
        </form>

        <div className="link">
          <Link to="/food-partner/register">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
