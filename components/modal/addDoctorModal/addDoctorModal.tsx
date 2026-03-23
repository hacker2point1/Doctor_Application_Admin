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






// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
// import CreateDoctor from "@/app/doctorCRUD/createDoctor/page";


// const CreateDoctorModal = ({ open, handleClose }: any) => {
//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      

//       <DialogContent>
//         <CreateDoctor closeModal={handleClose} />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateDoctorModal;


// "use client";

// import CreateDoctorForm from "@/app/doctorCRUD/createDoctor/page";
// import { Modal, Box, Paper, Fade, Backdrop } from "@mui/material";


// interface Props {
//   open: boolean;
//   handleClose: () => void;
// }

// const CreateDoctorModal = ({ open, handleClose }: Props) => {

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       closeAfterTransition
//       slots={{ backdrop: Backdrop }}
//       slotProps={{
//         backdrop: { timeout: 300 }
//       }}
//     >
//       <Fade in={open}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 520,
//             maxHeight: "90vh",
//             outline: "none"
//           }}
//         >
//           <Paper
//             sx={{
//               borderRadius: "16px",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "90vh"
//             }}
//           >
//             <CreateDoctorForm closeModal={handleClose} />
//           </Paper>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// };

// export default CreateDoctorModal;