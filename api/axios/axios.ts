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








// "use client";

// import axios from "axios";
// import { Cookies } from "react-cookie";

// export const BaseURL = "http://localhost:4000";

// export const axiosinstance = axios.create({
//   baseURL: BaseURL,
//   withCredentials: true,
// });

// axiosinstance.interceptors.request.use(
//   (config) => {
//     // if (typeof window !== "undefined") {
//     const cookies = new Cookies();
//     const token = cookies.get("token");
//     console.log("Token in Axios:", token);

//     if (token) {
//       config.headers = config.headers || {};
//       config.headers["x-access-token"] = token;
//     }
//     // }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// axiosinstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const cookies = new Cookies();
//         const refresh = cookies.get("token");

//         if (!refresh) throw new Error("Refresh token not found");

//         const response = await axios.post(`${BaseURL}/refresh-token`, {
//           token: refresh,
//         });

//         const newAccessToken = response.data.accessToken;

//         cookies.set("token", newAccessToken, {
//           path: "/",
//           sameSite: "lax",
//         });

//         originalRequest.headers["x-access-token"] = newAccessToken;

//         return axiosinstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh failed:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );





