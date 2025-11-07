import React from "react";
import { Link } from "react-router-dom";

const VerifyPending = () => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Email Verification Needed</h1>
      <p>We have sent a verification link to your email.</p>
      <p>Please check your inbox and spam folder.</p>

      <Link to="/user/login">Back to Login</Link>
    </div>
  );
};

export default VerifyPending;
