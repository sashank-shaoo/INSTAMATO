import React from "react";
import "../styles/flashMessage.css";
import { useFlash } from "../context/FlashContext";

const FlashMessage = () => {
  const { flash } = useFlash();

  if (!flash) return null;

  return <div className={`flash-message ${flash.type}`}>{flash.message}</div>;
};

export default FlashMessage;
