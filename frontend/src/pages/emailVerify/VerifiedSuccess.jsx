import React from "react";
import { Link } from "react-router-dom";

const VerifiedSuccess = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Email Verified ✅</h1>
      <p>Your email has been successfully verified.</p>

      <Link to="/user/login">
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#00c4ff",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            marginTop: "1rem",
          }}>
          Login Now
        </button>
      </Link>
    </div>
  );
};

export default VerifiedSuccess;
