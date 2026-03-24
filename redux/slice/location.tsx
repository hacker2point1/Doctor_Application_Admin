import { axiosInstance } from "@/api/axios/axios";
import { endpoints } from "@/api/endpoints/endpoints";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Interface } from "readline";
import { toast } from "sonner";



interface LocationState {
  loading: boolean;
  success: boolean;
  error: any;
  message: string;

}


const locationInitialState: LocationState = {
  loading: false,
  success: false,
  error: null,
  message: "",

};


export const createCenter = createAsyncThunk(
  "createCenter",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(endpoints.department.location, data); 
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const centerSlice = createSlice({
  name: "center",
  initialState:locationInitialState ,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCenter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCenter.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        toast.success("Location created successfully!");
      })
      .addCase(createCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const errorMessage = (action.payload as any)?.message || "Failed to create location";
        toast.error(errorMessage);
      });
  },
});

export default centerSlice.reducer;