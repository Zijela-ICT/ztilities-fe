import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the list of endpoints for which a success toast should appear
const successToastEndpoints: string[] = [];

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // No toast for request errors
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Skip toasts for GET requests
    if (response.config.method !== "get") {
      // Show success toast only if the endpoint is in the list
      if (
        successToastEndpoints.some((endpoint) =>
          response.config.url.includes(endpoint)
        )
      ) {
        const successMessage = response.data?.message || "Request successful!";
        toast.success(successMessage);
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      // Skip error toasts for GET requests
      if (config.method === "get") {
        return Promise.reject(error);
      }

      // Handle 401 errors
      if (status === 401) {
        if (config.url.includes("auth/login")) {
          // For `/auth/login`, show a toast and skip redirection
          toast.error(data.message || "Invalid login credentials.");
        } else {
          // For all other 401 responses, clear token and redirect
          toast.error("Session expired. Redirecting to login...");
          localStorage.removeItem("authToken");
          window.location.href = "/"; // Redirect to "/"
        }
      } else {
        // Handle other errors and show error toasts
        if (Array.isArray(data.message)) {
          data.message.forEach((msg: string) => {
            toast.error(msg);
          });
        } else {
          toast.error(data.message || "An unexpected error occurred.");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
