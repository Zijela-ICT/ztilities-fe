

import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "next/router"; // Import Next.js Router

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the list of endpoints for which a success toast should appear
const successToastEndpoints: string[] = [];

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // No toast for request error in case of GET requests
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: any) => {
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
console.log(config.url)
      // Handle 401 errors by redirecting to "/"
      if (status === 401 && !config.url.includes("auth/login")) {
        toast.error("Session expired. Redirecting to login...");
        Router.push("/"); // Redirect to "/"
      } else if (config.method !== "get") {
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
