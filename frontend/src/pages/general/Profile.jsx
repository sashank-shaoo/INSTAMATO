import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import UserProfile from "../user/UserProfile";
import FoodPartnerProfile from "../food-partner/FoodPartnerProfile";
import { useFlash } from "../../context/FlashContext";

const Profile = () => {
  const [role, setRole] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Fetch from your unified auth route
        const res = await axios.get("/auth/me");
        setRole(res.data.role);
        setProfileData(res.data.profile);
      } catch (error) {
        showFlash("Please log in to continue", "error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showFlash]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontFamily: "Poppins, sans-serif",
        }}>
        Loading profile...
      </div>
    );

  if (!profileData)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#d8861aff",
          backgroundColor: "#1e1e1e",
          height: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}>
        <img src="/profile.svg" alt="Profile" />
        <h1>Please log in again.</h1>
      </div>
    );

  // ✅ Dynamically render the correct component
  if (role === "user") {
    return <UserProfile userData={profileData} />;
  }

  if (role === "partner") {
    return <FoodPartnerProfile profileData={profileData} />;
  }

  return (
    <div style={{ textAlign: "center", color: "#aaa", marginTop: "25vh" }}>
      <p>Unexpected role. Please log in again.</p>
    </div>
  );
};

export default Profile;
