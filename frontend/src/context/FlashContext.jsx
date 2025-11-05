import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import "../styles/flashMessage.css";

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const [flash, setFlash] = useState(null);

  const showFlash = useCallback((message, type = "info", duration = 3000) => {
    setFlash({ message, type });
    setTimeout(() => setFlash(null), duration);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { message, type, duration } = e.detail;
      setFlash({ message, type });
      setTimeout(() => setFlash(null), duration);
    };

    window.addEventListener("global-flash", handler);
    return () => window.removeEventListener("global-flash", handler);
  }, []);

  return (
    <FlashContext.Provider value={{ showFlash }}>
      {children}
      {flash && (
        <div className={`flash-message ${flash.type}`}>{flash.message}</div>
      )}
    </FlashContext.Provider>
  );
};

export const useFlash = () => useContext(FlashContext);
