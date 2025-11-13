import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { useFlash } from "../../context/FlashContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/user/UserLogin.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // load cooldown from localStorage on mount to ensure persistence.  even if user refresh the page """""" cool right? """""
  useEffect(() => {
    const storedEndTime = localStorage.getItem("resendCooldownEnd");
    if (storedEndTime) {
      const remaining = Math.floor((storedEndTime - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem("resendCooldownEnd");
      }
    }
  }, []);

  // countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem("resendCooldownEnd");
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;

    if (!email || !password) {
      showFlash("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/auth/user/login", {
        email,
        password,
      });

      localStorage.removeItem("foodPartner");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", "user");
      }

      showFlash("Logged in successfully ✅", "success");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      if (
        err.response?.status === 403 &&
        err.response.data.message === "Email not verified"
      ) {
        showFlash("Email not verified. Please verify your email.", "error");
        setResendAvailable(true);
      } else {
        const msg = err.response?.data?.message || "Login failed";
        showFlash(msg, "error");
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

      const response = await axios.post("/auth/resend-verification", { email });
      showFlash(
        response.data.message || "Verification email resent ✅",
        "success"
      );

      // Start cooldown timer (2 min)
      setCooldown(120);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to resend verification email";
      const type = err.response?.data?.type || "error";
      showFlash(message, type);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>User Login</h1>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="* * * * * * * * * * * *"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Only show resend when login blocked */}
          {resendAvailable && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendLoading || cooldown > 0}
              style={{
                marginTop: "10px",
                background: cooldown > 0 ? "#aaa" : "#ff9900",
                color: "white",
                cursor: cooldown > 0 ? "not-allowed" : "pointer",
              }}>
              {resendLoading
                ? "Sending..."
                : cooldown > 0
                ? `Resend available in ${Math.floor(cooldown / 60)
                    .toString()
                    .padStart(2, "0")}:${(cooldown % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Resend Verification Email"}
            </button>
          )}
        </form>

        <div className="link">
          <Link to="/user/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
