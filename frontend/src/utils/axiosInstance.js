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
    const message = error.response?.data?.message;
    const requestUrl = error.config?.url;

    // ✅ Do NOT redirect on login/register/resend requests
    const isAuthRoute =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/resend-verification");

    if (status === 401 && !isAuthRoute) {
      showFlashGlobal("Session expired. Please log in again.", "error");

      // ✅ Redirect only for protected route session expiration
      setTimeout(() => (window.location.href = "/user/login"), 1500);
    } else if (message) {
      showFlashGlobal(message, "error");
    } else {
      showFlashGlobal("Something went wrong.", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
