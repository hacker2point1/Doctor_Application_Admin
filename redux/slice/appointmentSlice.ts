"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "@/api/endpoints/endpoints";
import { axiosInstance } from "@/api/axios/axios";
import { toast } from "sonner";


interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
}

interface AppointmentState {
  loading: boolean;
  error: string | null;
  appointmentList: Appointment[];
}

const appointmentInitialState: AppointmentState = {
  loading: false,
  error: null,
  appointmentList: [],
};

// get appointment list
export const getAppointmentList = createAsyncThunk<any, any>(
  "getAppointmentList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.appoinment.listOfAppoinments);
      console.log(response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// accept appointment
export const acceptAppointment = createAsyncThunk<any, string>(
  "acceptAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/admin/appointments/${id}/accept`, {});
      toast.success("Appointment accepted");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept appointment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// reject appointment
export const rejectAppointment = createAsyncThunk<any, string>(
  "rejectAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/admin/appointments/${id}/reject`, {});
      toast.success("Appointment rejected");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject appointment");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: appointmentInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get appointment list
      .addCase(getAppointmentList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.appointmentList = payload.data || [];
      })
      .addCase(getAppointmentList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // accept appointment
      .addCase(acceptAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data?._id) {
          const idx = state.appointmentList.findIndex((a) => a._id === payload.data._id);
          if (idx !== -1) {
            state.appointmentList[idx].status = "accepted";
          }
        }
      })
      .addCase(acceptAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // reject appointment
      .addCase(rejectAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data?._id) {
          const idx = state.appointmentList.findIndex((a) => a._id === payload.data._id);
          if (idx !== -1) {
            state.appointmentList[idx].status = "rejected";
          }
        }
      })
      .addCase(rejectAppointment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export default appointmentSlice.reducer;
