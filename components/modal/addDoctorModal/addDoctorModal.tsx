"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CreateDoctor from "@/app/doctorCRUD/createDoctor/page";


const CreateDoctorModal = ({ open, handleClose }: any) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      

      <DialogContent>
        <CreateDoctor closeModal={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDoctorModal;