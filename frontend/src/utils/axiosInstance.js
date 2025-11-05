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

    if (status === 401) {
      showFlashGlobal("Session expired. Please log in again.", "error");
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
