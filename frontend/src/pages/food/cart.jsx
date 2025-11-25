import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "../../styles/foodItem/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/cart");

      // Extract correct items path
      const items = response.data.cart?.items || [];
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );
    setTotalPrice(total.toFixed(2));
  };

  const handleRemoveItem = async (foodId) => {
    try {
      await axios.delete(`/cart/remove`, {
        data: { foodId },
      });
      setCartItems((prev) => prev.filter((item) => item.food?._id !== foodId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Navigate to checkout or payment page
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        {/* Header */}
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="cart-title">YOUR CART</h1>
        </div>

        {/* Cart Items List */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="browse-btn" onClick={() => navigate("/")}>
              Browse Foods
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.food?._id}>
                  <img
                    src={item.food?.image}
                    alt={item.food?.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.food?.name}</h3>
                    <p className="cart-item-price">${item.food?.price}</p>
                    <p className="cart-item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.food?._id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="cart-total-section">
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">${totalPrice}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Delivery Fee:</span>
                <span className="total-value">$5.00</span>
              </div>
              <div className="total-row total-final">
                <span className="total-label">TOTAL:</span>
                <span className="total-value">
                  ${(parseFloat(totalPrice) + 5.0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="checkout-btn" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </button>
          </>
        )}

        {/* Footer Navbar Placeholder */}
        <div className="cart-navbar-footer">NAVBAR</div>
      </div>
    </div>
  );
};

export default Cart;
