import axios from "axios";
import { log } from "console";
import {  Cookies } from "react-cookie";

 const adminURL = `http://localhost:4000`;
export const axiosInstance = axios.create({
  baseURL: adminURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  function (config) {
    const cookie = new Cookies();
    const token = cookie.get("token"); 
    console.log("Token from cookie:", token);
    if (token) {
      config.headers["x-access-token"] = token; 
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/admin/refresh-token");

        const newAccessToken = response.data.token;
        

        const cookies = new Cookies();
        cookies.set("token", newAccessToken, { path: "/" });

        originalRequest.headers["x-access-token"] = newAccessToken;
        console.log("New Access Token:", newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed. Login again.");
      }
    }

    return Promise.reject(error);
  },
);
