import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "../../styles/foodItem/FoodStyle.css";

const FoodItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await axios.get(`/food/${id}`);
        setFoodItem(response.data.foodItem || response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food item:", error);
        setLoading(false);
      }
    };
    fetchFoodItem();
  }, [id]);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      alert("Please select quantity first!");
      return;
    }
    // Add your cart logic here
    console.log(`Added ${quantity} of ${foodItem.name} to cart`);
  };

  const handlePreviewClick = (e) => {
    e.preventDefault();
    if (foodItem.video) {
      setShowVideoPopup(true);
    } else {
      alert("No video available for this food item");
    }
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
  };

  if (loading) {
    return (
      <div className="food-item-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="food-item-container">
        <div className="error-message">Food item not found</div>
      </div>
    );
  }

  return (
    <div className="food-item-container">
      <div className="food-item-wrapper">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Food Image */}
        <div className="food-image-section">
          <img
            src={foodItem.image || foodItem.video}
            alt={foodItem.name}
            className="food-item-image"
          />
        </div>

        {/* Food Details Card */}
        <div className="food-details-card">
          {/* Top Section: Image Thumbnail, Name, Price */}
          <div className="food-header">
            <img
              src={foodItem.image || foodItem.video}
              alt={foodItem.name}
              className="food-thumbnail"
            />
            <div className="food-basic-info">
              <h2 className="food-name">{foodItem.name}</h2>
              <p className="food-price">
                ${foodItem.price || "Price not available"}
              </p>
            </div>
          </div>

          {/* Preview Link */}
          <a href="#" className="preview-link" onClick={handlePreviewClick}>
            preview the food
          </a>

          {/* Description Section */}
          <div className="food-description-section">
            <h3 className="description-title">Description:</h3>
            <p className="food-description">
              {foodItem.description || "No description available."}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <span className="quantity-label">QUANTITY:</span>
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={handleDecrease}>
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button className="quantity-btn" onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Video Popup Modal */}
      {showVideoPopup && (
        <div className="video-popup-overlay" onClick={closeVideoPopup}>
          <div
            className="video-popup-panel"
            onClick={(e) => e.stopPropagation()}>
            <button className="video-close-btn" onClick={closeVideoPopup}>
              ×
            </button>
            <div className="video-container">
              <video controls autoPlay className="food-video">
                <source src={foodItem.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
