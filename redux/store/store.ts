import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import { departmentReducer, doctorReducer } from "../slice/doctorCRUDSlice";
import appointmentReducer from "../slice/appointmentSlice";


const store = configureStore({
  reducer: {
    auth: authSlice,
    department: departmentReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;