"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "@/api/endpoints/endpoints";
import { axiosInstance } from "@/api/axios/axios";
import { toast } from "sonner";


interface Appointment {
  _id: string;
  name: string;
  doctorId: string;
  date: string;
  time?: string;
  timeSlot?: string;
  status: string;
}

interface AppointmentState {
  loading: boolean;
  error: string | null;
  appointmentList: Appointment[];
  acceptedAppoinmentList: Appointment[];
}

const appointmentInitialState: AppointmentState = {
  loading: false,
  error: null,
  appointmentList: [],
  acceptedAppoinmentList: [],
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
//accepted list
export const getAllAcceptedAppoinmentList = createAsyncThunk<Appointment[], void>(
  "getAllAcceptedAppoinmentList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.appoinment.acceptedAppoinments);

      // Normalize different response shapes (array vs { data: [] })
      const data =
        Array.isArray(response.data) ? response.data : response.data?.data ?? [];

      return data;
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
      const response = await axiosInstance.put(endpoints.appoinment.confirmById(id), {});
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
      const response = await axiosInstance.put(endpoints.appoinment.cancelById(id), {});
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
        state.appointmentList = payload?.data || [];
      })
      .addCase(getAppointmentList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // list of accepted appoinments
      .addCase(getAllAcceptedAppoinmentList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAcceptedAppoinmentList.fulfilled, (state, { payload }) => {
        state.acceptedAppoinmentList = Array.isArray(payload) ? payload : payload?.data || [];
        state.loading = false;
      })
      .addCase(getAllAcceptedAppoinmentList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // accept appointment
      .addCase(acceptAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptAppointment.fulfilled, (state, { payload }) => {
        state.loading = false;


        const appointment = payload?.data ?? payload;
        const id = appointment?._id;

        if (id) {
          const idx = state.appointmentList.findIndex((a) => a._id === id);
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

        const appointment = payload?.data ?? payload;
        const id = appointment?._id;

        if (id) {
          const idx = state.appointmentList.findIndex((a) => a._id === id);
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
