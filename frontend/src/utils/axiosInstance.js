import axios from "axios";
import { showFlashGlobal } from "../utils/globalFlash";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message;
    const type = data?.type || "error"; // ✅ use backend type or default to "error"
    const requestUrl = error.config?.url;

    const isAuthRoute =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/resend-verification");

    if (status === 401 && !isAuthRoute) {
      showFlashGlobal("Session expired. Please log in again.", "error");

      setTimeout(() => (window.location.href = "/user/login"), 1500);
    }

    //show backend message if available
    else if (message) {
      showFlashGlobal(message, type);
    }
    // Generic error message for other cases
    else {
      showFlashGlobal("Something went wrong.", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
