"use client";

import CreateDoctor from "@/app/doctorCRUD/createDoctor/page";

import ModalWrapper from "@/components/ui/modalWrapper/modalWrapper";




export default function AddDoctorModal({ open, handleClose }: any) {

  return (

    <ModalWrapper open={open} onClose={handleClose} width={650}>

      <CreateDoctor closeModal={handleClose} />

    </ModalWrapper>

  );

}

