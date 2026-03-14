"use client";

import { Modal, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
// import { closeModal } from "@/redux/slice/modalSlice";

// import AddDoctorModal from "./AddDoctorModal";
import { closeModal } from "@/redux/slice/modalSlice/modalSlice";
import AddDoctorModal from "../addDoctorModal/addDoctorModal";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

export default function GlobalModal() {
  const dispatch = useDispatch();
  const { open, type } = useSelector((state: RootState) => state.modal);

  const renderModal = () => {
    switch (type) {
      case "ADD_DOCTOR":
        return <AddDoctorModal />;
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={() => dispatch(closeModal())}>
      <Box sx={style}>{renderModal()}</Box>
    </Modal>
  );
}