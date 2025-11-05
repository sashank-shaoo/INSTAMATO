import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";
import "../../styles/user/UserProfile.css";


const UserProfile = ({ userData: propUserData }) => {
  const [userData, setUserData] = useState(propUserData || null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    if (propUserData) {
       setLoading(false);
      return; // Skip fetch if data is provided via props
    }
    const getUser = async () => {
      try {
        const response = await axios.get("/user/profile");
        const data = response.data.user || response.data.data || response.data;
        setUserData(data);
      } catch (error) {
        if (error.response?.status === 401) {
          showFlash("Please login to continue", "error");
          navigate("/login");
        } else {
          showFlash("Error fetching user data", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [showFlash, navigate, propUserData]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axios.get("/auth/user/logout");
      navigate("/user/login");
    } catch {
      showFlash("Logout failed", "error");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return <div className="user-loading">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="user-error">Unable to load profile.</div>;
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className="user-name">{userData.fullName}</h1>
        <p className="user-email">{userData.email}</p>
      </div>

      <div className="user-actions">
        {/* Edit Profile */}
        <Link to="/profile/edit" className="user-icon" title="Edit Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </Link>

        {/* Saved Reels */}
        <Link
          to="/profile/saved-reels"
          className="user-icon"
          title="Saved Reels">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>

        {/* Logout */}
        <button
          className="user-icon logout"
          onClick={handleLogout}
          title="Logout"
          disabled={loggingOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
