"use client";

import { Modal, Box } from "@mui/material";
import DepartmentPage from "@/app/doctorCRUD/departmentId/page";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "white",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  p: 4,
};

export default function AddDepartmentModal({ open, handleClose }: any) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* forward close handler so inner form can call it on successful submit */}
        <DepartmentPage isModal onClose={handleClose} />
      </Box>
    </Modal>
  );
}