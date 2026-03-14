import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  open: boolean;
  type: string | null;
  payload?: any;
}

const initialState: ModalState = {
  open: false,
  type: null,
  payload: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: string; payload?: any }>
    ) => {
      state.open = true;
      state.type = action.payload.type;
      state.payload = action.payload.payload;
    },

    closeModal: (state) => {
      state.open = false;
      state.type = null;
      state.payload = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;