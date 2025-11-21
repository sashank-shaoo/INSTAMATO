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
    const backendType = error.response?.data?.type;
    const requestUrl = error.config?.url;

    const isAuthRoute =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/resend-verification");

    if (status === 401 && !isAuthRoute) {
      showFlashGlobal("Session expired. Please log in again.", "error");
      setTimeout(() => (window.location.href = "/user/login"), 1500);
    } else if (message) {
      showFlashGlobal(message, backendType || "error");
    } else {
      showFlashGlobal("Something went wrong.", "error");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
