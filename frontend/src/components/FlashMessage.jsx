import React from "react";
import "../styles/FlashMessage.css";
import { useFlash } from "../context/FlashContext";

const FlashMessage = () => {
  const { flash } = useFlash();

  if (!flash || !flash?.message) return null;

  return (
    <div className={`flash-message ${flash.type}`}>
      <p>{flash.message}</p>
    </div>
  );
};

export default FlashMessage;
