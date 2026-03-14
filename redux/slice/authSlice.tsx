"use client";
import { axiosInstance } from "@/api/axios/axios";
// import { axiosinstance } from "@/api/axios/axios";
// import AxiosInstance from "@/api/axios/axios";
import { endpoints } from "@/api/endpoints/endpoints";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Cookies } from "react-cookie";


const cookie = new Cookies()

interface AuthState {
  isLoggedIn: boolean;
  loading : boolean,
  success: boolean,
  error:string | null
}

interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
}
interface adminLogoutResponse{
  loading: boolean;
  success: boolean;
  error: string | null;
}


const initialState: AuthState = {
  isLoggedIn: false,
  loading : false,
  success:false,
  error:null
};

export const authLogin = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>("authLogin", async (payload) => {
  const response = await axiosInstance.post(
    endpoints.admin.login,
    payload
  );

  return response.data;
});
export const logoutAdmin = createAsyncThunk(
  "logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.logout.adminLogout);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state , {payload}) => {
        state.loading = true
      })
      .addCase(authLogin.fulfilled, (state, { payload }) => {
        if (payload.status === true) {
          state.isLoggedIn = true; 
           state.loading = false
        }
      })
      .addCase(authLogin.rejected, (state , {payload}) => {
        state.loading = false
      })
     

       .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        cookie.remove("token",{path:"/"})
        state.success = true;
      })
      .addCase(logoutAdmin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;


