import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/user/userProfileEdit.css";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const { showFlash } = useFlash();
  const [user, setUser] = useState({ fullName: "", bio: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/profile");
        setUser(res.data.user || res.data);
      } catch {
        showFlash("⚠️ Failed to load user data.", "error");
      }
    };
    fetchUser();
  }, [showFlash]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user.fullName.trim()) {
      showFlash("Name cannot be empty", "error");
      setLoading(false);
      return;
    }

    try {
      const { email: _email, password: _password, ...updatableData } = user;
      await axios.put("/user/profile/edit", updatableData);
      showFlash("✅ Profile updated successfully!", "success");
      setTimeout(() => navigate("/profile"), 1500);
    } catch {
      showFlash("Update failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="wraper">
      <div className="profile-container">
        <h2 className="profile-title">Edit Your Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateUserProfile;
