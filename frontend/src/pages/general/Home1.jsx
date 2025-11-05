import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";
import "../../styles/general/home1.css";

const Home1 = () => {
  const [partners, setPartners] = useState([]);
  const { showFlash } = useFlash();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("/food-partner");
        const data = response.data?.data || response.data;
        setPartners(data);
      } catch {
        showFlash("Error fetching food partners:", "error");
      }
    };
    fetchPartners();
  }, [showFlash]);

  return (
    <div className="home1-container">
      <div className="home1-wrapper">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-logo">
            <img src="../../../public/icon.svg" alt="Logo" />
            <p>InstaMato</p>
          </div>

          <h1 className="hero-heading">
            <span>Discover, Taste & Share</span>
          </h1>

          <p className="hero-tagline">
            Experience food like never before 🍔✨ — scroll through our short
            food reels and explore dishes from local restaurants & chefs around
            you.
          </p>

          {/* Floating 3D Food Model */}
          <div className="floating-food"></div>
        </div>

        {/* Partners Section */}
        <div className="partners-section">
          <h2 className="partners-heading">🍴 Our Food Partners</h2>
          <p className="partners-subtext">
            Collaborating with amazing creators and kitchens that bring flavor
            to your screen.
          </p>

          <div className="partners-grid">
            {partners.length === 0 ? (
              <p className="loading-text">Loading partners...</p>
            ) : (
              partners.map((partner) => (
                <div key={partner._id} className="partner-homecard">
                  <div>
                    <h2 className="partner-name">{partner.name}</h2>
                  </div>
                  <Link
                    to={`/food-partner/${partner._id}`}
                    className="partner-link">
                    View Profile →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home1;
