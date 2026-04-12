// hooks/useAxiosSecure.ts
import { useEffect } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import useAuth from "./useAuth";

// Create axios instance
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAxiosSecure = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Request interceptor - Add token to headers
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle token expiration
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If unauthorized and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Token expired or invalid
          localStorage.removeItem("accessToken");
          localStorage.removeItem("sns-user");
          logout();

          Swal.fire({
            icon: "warning",
            title: "সেশন শেষ!",
            text: "আপনার সেশন শেষ হয়ে গেছে। দয়া করে আবার লগইন করুন।",
            confirmButtonColor: "#16a34a",
          }).then(() => {
            window.location.href = "/login";
          });

          return Promise.reject(error);
        }

        // Handle other errors
        if (error.response?.status === 403) {
          Swal.fire({
            icon: "error",
            title: "অনুমতি নেই!",
            text: "এই কাজটি করার জন্য আপনার অনুমতি নেই।",
            confirmButtonColor: "#16a34a",
          });
        }

        return Promise.reject(error);
      },
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return axiosSecure;
};
