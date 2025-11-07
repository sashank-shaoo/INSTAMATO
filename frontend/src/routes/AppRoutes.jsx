
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Home2 from "../pages/general/Home2";
import CreateFood from "../pages/food-partner/CreateFood";
import FoodPartnerProfile from "../pages/food-partner/FoodPartnerProfile";
import Home1 from "../pages/general/Home1";
import SavedReels from "../pages/general/SavedReels";
import Profile from "../pages/general/Profile";
import UpdateUserProfile from "../pages/user/UpdateUserProfile";
import UpdateFoodProfile from "../pages/food-partner/UpdateFoodProfile";
import VerifyEmail from "../pages/emailVerify/VerifyEmail";
import VerifiedSuccess from "../pages/emailVerify/VerifiedSuccess";
import VerifyPending from "../pages/emailVerify/VerifyPending";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
      <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
      <Route path="/" element={<Home1 />} />
      <Route path="/reels" element={<Home2 />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<UpdateUserProfile />} />
      <Route path="/profile/saved-reels" element={<SavedReels />} />
      <Route path="/create-food" element={<CreateFood />} />
      <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />
      <Route path="/food-partner/:id/edit" element={<UpdateFoodProfile />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/verify-pending" element={<VerifyPending />} />
  <Route path="/verified-success" element={<VerifiedSuccess />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
