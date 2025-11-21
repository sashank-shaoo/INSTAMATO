import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/general/home1.css";
import { useFlash } from "../../context/FlashContext";
import { Link } from "react-router-dom";

const Home1 = () => {
  const [foodItems, setFoodItems] = useState([]);
  const { showFlash } = useFlash();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get("/food");

        const items = (response.data.foodItems || response.data).map(
          (item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
          })
        );
        setFoodItems(items);
      } catch (error) {
        console.error("Error fetching food items", error);
        const msg = error?.response?.data?.message || "Failed to Fetch Foods";
        const type = error?.response?.data?.type || "error";
        showFlash(msg, type);
      }
    };
    fetchFood();
  }, [showFlash]);

  return (
    <div className="home1-container">
      <div className="home1-wrapper">
        <div className="top-title">
          <h2 className="home1-title">INSTAMATO</h2>
          <div className="filter-section"></div>
        </div>
        <div className="food-list-section">
          {foodItems.length === 0 ? (
            <p>Loading food items...</p>
          ) : (
            foodItems.map((food, idx) => (
              <div className="food-card" key={food._id || idx}>
                <img
                  className="food-image"
                  src={food.image || food.video}
                  alt={food.name}
                />
                <div className="food-info">
                  <span className="food-name">{food.name}</span>
                  <span className="food-price">${food.price}</span>
                </div>
                <Link to={`/${food.id}`} className="add-cart-btn">
                  View
                </Link>
              </div>
            ))
          )}
        </div>
        <div className="navbar-footer">FOODS</div>
      </div>
    </div>
  );
};

export default Home1;
