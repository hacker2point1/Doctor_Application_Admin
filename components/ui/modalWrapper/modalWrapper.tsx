"use client";

import { Modal, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export default function ModalWrapper({
  open,
  onClose,
  children,
  width = 700,
}: Props) {

  const theme = useTheme();

  return (

    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.2)"
      }}
    >

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: width,
          maxWidth: "95%",
          maxHeight: "90vh",
          overflowY: "auto",

          bgcolor: theme.palette.background.paper,
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",

          p: 4
        }}
      >

        {children}

      </Box>

    </Modal>

  );

}