"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@mui/material";
import DoctorDetailsUpdate from "@/app/doctorCRUD/doctorDetailsUpdate/page";
import ModalWrapper from "@/components/ui/modalWrapper/modalWrapper";

// import DoctorDetailsUpdate from "@/app/doctorCRUD/doctorDetailsUpdate/[id]/page";

const EditDoctorModal = ({ open, handleClose, doctorId }: any) => {
  return (
    <ModalWrapper open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
        <DoctorDetailsUpdate closeModal={handleClose} doctorId={doctorId} />
      </DialogContent>
    </ModalWrapper>
  );
};

export default EditDoctorModal;


// "use client";


// import DoctorDetailsUpdate from "@/app/doctorCRUD/doctorDetailsUpdate/page";
// import ModalWrapper from "@/components/ui/modalWrapper/modalWrapper";



// export default function EditDoctorModal({ open, handleClose }: any) {

//   return (

//     <ModalWrapper open={open} onClose={handleClose} width={650}>

//       <DoctorDetailsUpdate onClose={handleClose} />

//     </ModalWrapper>

//   );

// }