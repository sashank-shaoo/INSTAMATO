import React from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/form.css";
import { useFlash } from "../../context/FlashContext";

const FoodPartnerLogin = () => {
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
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

      // ✅ Save food partner data
      if (
        response.data.foodPartner ||
        response.data.data ||
        response.data.user
      ) {
        localStorage.setItem(
          "foodPartner",
          JSON.stringify(
            response.data.foodPartner ||
              response.data.data ||
              response.data.user
          )
        );
      }

      // ✅ Set role
      localStorage.setItem("role", "foodPartner");

      showFlash("Logged in successfully as Food Partner!", "success");
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      showFlash("Food Partner login failed", "error");
    }
  };

  return (
    <div className="whole-page">
      <div className="container">
        <h1>Food Partner Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="* * * * * * * * * * * *"
              name="password"
              required
            />
          </div>
          <button type="submit">Login</button>
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
