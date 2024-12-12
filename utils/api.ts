import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
    toast.error("An error occurred while sending the request.");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response:any) => {
    // Show success toast only if the endpoint is in the list and method is not GET
    if (
      response.config.method !== "get" &&
      successToastEndpoints.some((endpoint) =>
        response.config.url.includes(endpoint)
      )
    ) {
      const successMessage = response.data?.message || "Request successful!";
      toast.success(successMessage);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { config, status, data } = error.response;
      if (status === 401) {
        toast.error("Unauthorized access - please log in again.");
      } else {
        toast.error(data.message || "An unexpected error occurred.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
