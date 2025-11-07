import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";


const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setFlash } = useFlash();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (!token) {
      setStatus("missing");
      setFlash("Invalid verification link", "error");
      return;
    }

    const verify = async () => {
      try {
        await axios.get(`/auth/verify-email?token=${token}`);
        navigate("/verified-success");
      } catch (error) {
        setStatus("error",error);
        setFlash("Verification link expired or invalid.", "error");
      }
    };

    verify();
  }, [navigate, setFlash]);

  if (status === "loading") {
    return <h2>Verifying your email...</h2>;
  }

  if (status === "missing") {
    return <h2>Invalid verification link</h2>;
  }

  if (status === "error") {
    return <h2>Verification link expired or invalid.</h2>;
  }

  return null;
};

export default VerifyEmail;
