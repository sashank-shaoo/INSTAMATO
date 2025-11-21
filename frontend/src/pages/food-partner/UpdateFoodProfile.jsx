import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/foodPartner/FoodPartnerProfileEdit.css";
import { useParams, useNavigate } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";

const FoodPartnerProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState({
    name: "",
    contactName: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { showFlash } = useFlash();
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await axios.get(`/food-partner/${id}`);
        const data = response.data.foodPartner || response.data;
        setPartner(data);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load partner data.";
        const type = error.response?.data?.type || "error";
        showFlash(message, type);
      }
    };
    fetchPartner();
  }, [id, showFlash]);

  const handleChange = (e) => {
    setPartner({ ...partner, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email: _email, password: _password, ...updatableData } = partner;
     const response = await axios.put(
        `/food-partner/${id}/edit`,
        updatableData
      );
      const message = response.data.message + " Redirecting..." || "Partner profile updated successfully! Redirecting...";
      const type = response.data.type || "success";
      showFlash(message, type);
      setTimeout(() => navigate(`/food-partner/${id}`), 1500);
    } catch(error) {
      if(error.response.status === 401) {
        showFlash("Please login as a food partner", "error");
      }else{
        const message = error.response?.data?.message || "Error on Updating partner profile";
        const type = error.response?.data?.type || "error";
        showFlash(message, type);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-container">
      <div className="partner-card">
        <h2 className="partner-title">Edit Food Partner Profile</h2>

        <form className="partner-form" onSubmit={handleSubmit}>
          <label>Food Partner Name</label>
          <input
            type="text"
            name="name"
            value={partner.name || ""}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Contact Name</label>
          <input
            type="text"
            name="contactName"
            value={partner.contactName || ""}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={partner.address || ""}
            onChange={handleChange}
            placeholder="Enter address"
            disabled={loading}
          />

          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={partner.phone || ""}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default FoodPartnerProfileEdit;
