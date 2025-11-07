import React, { useState } from "react";
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

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      localStorage.setItem("role", "user");

      showFlash("Logged in successfully ✅", "success");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Auto-detect unverified email from backend
      if (
        err.response?.status === 403 &&
        err.response.data.message === "Email not verified"
      ) {
        showFlash("Your email is not verified. Please verify first.", "error");
        setResendAvailable(true);
      } else {
        showFlash("Invalid credentials. Try again.", "error");
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

      showFlash("Verification email resent ✅", "success");
      setResendAvailable(false); // hide button after successful send
    } catch {
      showFlash("Failed to resend verification email", "error");
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

          {resendAvailable && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendLoading}
              style={{
                marginTop: "10px",
                background: "#ff9900",
                color: "white",
              }}>
              {resendLoading ? "Sending..." : "Resend Verification Email"}
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
