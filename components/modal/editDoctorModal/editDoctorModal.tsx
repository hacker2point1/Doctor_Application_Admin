"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@mui/material";
import DoctorDetailsUpdate from "@/app/doctorCRUD/doctorDetailsUpdate/page";

// import DoctorDetailsUpdate from "@/app/doctorCRUD/doctorDetailsUpdate/[id]/page";

const EditDoctorModal = ({ open, handleClose, doctorId }: any) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
        <DoctorDetailsUpdate closeModal={handleClose} doctorId={doctorId} />
      </DialogContent>
    </Dialog>
  );
};

export default EditDoctorModal;