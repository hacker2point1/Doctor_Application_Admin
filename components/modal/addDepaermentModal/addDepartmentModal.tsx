"use client";

import DepartmentFormModal from "@/app/doctorCRUD/departmentId/page";
import ModalWrapper from "@/components/ui/modalWrapper/modalWrapper";



export default function AddDepartmentModal({ open, handleClose }: any) {

  return (

    <ModalWrapper open={open} onClose={handleClose} width={650}>

      <DepartmentFormModal onClose={handleClose} />

    </ModalWrapper>

  );

}

