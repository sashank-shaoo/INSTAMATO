import React, { useState, useEffect } from "react";
import "../../styles/variables.css";
import "../../styles/foodPartner/FoodPartnerProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { useFlash } from "../../context/FlashContext";

export default function FoodPartnerProfile({ profileData: propProfileData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(propProfileData || null);
  const [videos, setVideos] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();

  // --- logged-in partner info ---
  const loggedInPartner = JSON.parse(localStorage.getItem("foodPartner"));
  const partnerIdFromStorage =
    loggedInPartner?._id?.toString() || loggedInPartner?.id?.toString();

  // --- Determine ownership ---
  const isOwner =
    !id ||
    (partnerIdFromStorage && id && partnerIdFromStorage === id.toString());

  // --- Fetch profile data ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const partnerId = id || partnerIdFromStorage;
        if (!partnerId) throw new Error("Missing partner ID");

        const response = await axios.get(`/food-partner/${partnerId}`);
        const data =
          response.data.foodPartner || response.data || response.data.data;
        if (!data) throw new Error("Invalid response format from server");

        setProfileData(data);
        setVideos(data.foodItems || []);
      } catch (error) {
        console.error("Error fetching partner:", error);
        if (error.response?.status === 401) {
          showFlash("Please login to continue", "error");
        } else {
          showFlash("Error fetching food partner profile", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, partnerIdFromStorage, showFlash, propProfileData]);

  // --- Icon Handlers ---
  const handleEdit = () => {
    const partnerId = id || partnerIdFromStorage;
    if (!partnerId) return showFlash("Partner ID not found", "error");
    navigate(`/food-partner/${partnerId}/edit`);
  };

  const handleCreate = () => navigate(`/create-food`);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axios.get("/auth/food-partner/logout");
      showFlash("Logged out successfully", "success");
      navigate("/food-partner/login");
    } catch (error) {
      console.error("Logout error:", error);
      showFlash("Error logging out", "error");
    } finally {
      setLoggingOut(false);
    }
  };

  // --- Loading / not found ---
  if (loading)
    return (
      <div className="partner-profile">
         <div
            style={{
              height: "3.4rem",
              width: "3.4rem",
              margin: "auto"
            }}>
            <img src="/loader.svg" alt="loader" />
            <p>Loading...</p>
          </div>
        </div>
    );
  if (!profileData)
    return (
      <div className="partner-profile">
        <div className="message-cont">
          <p
            style={{
              color: "aqua",
            }}>
            No Data
          </p>
        </div>
      </div>
    );

  return (
    <div className="partner-profile">
      <div className="profile-card">
        <div className="profile-top">
          <div className="avatar">
            <p className="avatarP">{profileData.name?.charAt(0) || "F"}</p>
          </div>

          <div className="business-info">
            <h3 className="business-name">
              {profileData.name || profileData.contactName}
            </h3>
            <p className="address">{profileData.address}</p>
            <p className="address">{profileData.email}</p>
          </div>

          {/* Icon Actions (visible only for owner) */}
          {isOwner && (
            <div className="status icons">
              <p>Partner Controller</p>
              <div className="icon-buttons">
                {/* Edit */}
                <div
                  className="icon-wrapper"
                  onClick={handleEdit}
                  title="Edit Profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </div>

                {/* Create */}
                <div
                  className="icon-wrapper"
                  onClick={handleCreate}
                  title="Add Item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>

                {/* Logout */}
                <div
                  className="icon-wrapper logout"
                  onClick={handleLogout}
                  title="Logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-svg"
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
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat">
            <p className="stat-label">Total Meals</p>
            <h3 className="stat-value">{videos.length}</h3>
          </div>
          <div className="stat">
            <p className="stat-label">Customers Served</p>
            <h3 className="stat-value">15K</h3>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((video, i) => (
            <div className="video-card" key={i}>
              <video
                src={video.video}
                className="video-thumb"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controls={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
