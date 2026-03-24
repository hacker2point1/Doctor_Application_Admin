import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import { departmentReducer, doctorReducer } from "../slice/doctorCRUDSlice";
import appointmentReducer from "../slice/appointmentSlice";
import centerSlice from "../slice/location";


const store = configureStore({
  reducer: {
    auth: authSlice,
    department: departmentReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
    center: centerSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;