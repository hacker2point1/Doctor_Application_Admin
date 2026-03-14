import { axiosInstance } from "@/api/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface AppointmentState {
  appointmentList: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointmentList: [],
  loading: false,
  error: null,
};

export const getAppointmentList = createAsyncThunk(
  "getAppointmentList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/doctor/appointment/list"
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const acceptAppointment = createAsyncThunk(
  "acceptAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/doctor/appointment/accept/${id}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const rejectAppointment = createAsyncThunk(
  "rejectAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/doctor/appointment/reject/${id}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const appoinmentSlice = createSlice({
    name:"appoinmentSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(appoinmentSlice.pending , (state,{payload})=>{
            state.loading = true
        })
        .addCase(appoinmentSlice.fulfilled , (state,{payload})=>{
            state.loading = false
        })
        .addCase(appoinmentSlice.rejected , (state,{payload})=>{
            state.loading = true
        })
    }
})


export default appoinmentSlice.reducer