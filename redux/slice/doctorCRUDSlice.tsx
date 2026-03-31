"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "@/api/endpoints/endpoints";
import { toast } from "sonner";
import { axiosInstance } from "@/api/axios/axios";
import { create } from "node:domain";

//  DEPARTMENT SLICE

interface DepartmentState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string;
  currentDepartmentId: string | null;
}

const departmentInitialState: DepartmentState = {
  loading: false,
  success: false,
  error: null,
  message: "",
  currentDepartmentId: null,
};

//  DOCTOR SLICE

interface DoctorState {
  loading: boolean;
  error: string | null;
  departmentList: any[];
  doctorList: any[];
  totalDoctor: number;
}

const doctorInitialState: DoctorState = {
  loading: false,
  error: null,
  departmentList: [],
  doctorList: [],
  totalDoctor: 0,
};

//add department
export const addDepartment = createAsyncThunk<
  any,
  { name: string; description: string }
>("department/addDepartment", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      endpoints.department.createDeptId,
      payload,
    );

    console.log("Department API Response:", response.data);
    toast.success(response.data.message || "Department added successfully");

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Something went wrong";

    toast.error(message);
    return rejectWithValue(message);
  }
});




const departmentSlice = createSlice({
  name: "department",
  initialState: departmentInitialState,
  reducers: {
    resetDepartmentState: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDepartment.fulfilled, (state, { payload }) => {
        if (payload.department._id) {
          localStorage.setItem("id", payload.department._id);
        }
        state.loading = false;
        state.success = true;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});




//create doctor
export const createDoctor = createAsyncThunk<any, any>(
  "createDoctor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        endpoints.department.createDoctor,
        payload,
      );
      console.log(response);

      console.log("Doctor API Response:", response.data);
      toast.success(response.data.message || "Doctor created successfully");

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create doctor";

      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

//get department list
export const getDepartmentList = createAsyncThunk<any, any>(
  "getDepaermentList",
  async (payload: any) => {
    const response = await axiosInstance.get(
      endpoints.department.departmentList,
      { params: payload }
    );
    // console.log(response , "department List")
    return response.data;
  },
);
type DoctorParams={
page: number,
limit:number,
search?:string

}
//get doctor list
export const getDoctorList = createAsyncThunk<any, DoctorParams>(
  "getDoctorList",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        endpoints.doctor.doctorList,
        {
          params: {
            page,
            limit,
            search
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);




//update doctor details
export const updateDoctorDetails = createAsyncThunk(
  "updateDoctorDetails",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        endpoints.doctor.updateDoctor,
        {
          id,
          ...data,
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update doctor failed"
      );
    }
  }
);

//delete doctor
export const deleteDoctor = createAsyncThunk(
  "deleteDoctor",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/doctor/delete",
        { id });

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }

  }
);


//delete department

export const deleteDepartment = createAsyncThunk(
  "deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        endpoints.department.deleteDepartment,
        { id }
      );

      toast.success(response.data?.message || "Department deleted");
      return { id };

    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete department";

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: doctorInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDoctor.pending, (state, { payload }) => {
        state.loading = true;
      })

      .addCase(createDoctor.fulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload?.data) {
          state.doctorList.unshift(payload?.data);
          state.totalDoctor += 1;
          console.log(payload.data);
        }
      })
      .addCase(createDoctor.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // update doctor details
      .addCase(updateDoctorDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctorDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data) {
          const idx = state.doctorList.findIndex((d) => d._id === payload.data._id);
          if (idx !== -1) {
            state.doctorList[idx] = payload.data;
          }
        }
      })
      .addCase(updateDoctorDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      //get department list
      .addCase(getDepartmentList.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getDepartmentList.fulfilled, (state, { payload }) => {
        state.departmentList = payload.data;
        // console.log(payload.data)
        state.loading = false;
      })
      .addCase(getDepartmentList.rejected, (state, { payload }) => {
        state.loading = false;
      })

      //get doctor list
      .addCase(getDoctorList.pending, (state, { payload }) => {
        state.loading = true;
      })

      .addCase(getDoctorList.fulfilled, (state, { payload }) => {
        state.doctorList = payload.data;
        state.totalDoctor = payload.total || payload.totalDoctor || 0;
        console.log(payload);
        state.loading = false;
      })
      .addCase(getDoctorList.rejected, (state, { payload }) => {
        state.loading = false;
      })


      //delete doctor
      .addCase(deleteDoctor.pending, (state, { payload }) => {
        state.loading = true
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false
        state.doctorList = state.doctorList.filter(
          (doctor: any) => doctor?._id !== action.meta.arg
        )
        state.totalDoctor -= 1;

      })

      .addCase(deleteDoctor.rejected, (state, { payload }) => {
        state.loading = true;
      })

      //delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;

        state.departmentList = state.departmentList.filter(
          (dept: any) => dept._id !== action.payload.id
        );
      })

      .addCase(deleteDepartment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetDepartmentState } = departmentSlice.actions;

export const departmentReducer = departmentSlice.reducer;
export const doctorReducer = doctorSlice.reducer;
