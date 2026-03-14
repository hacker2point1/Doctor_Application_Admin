"use client";

import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  text: string;
  startIcon?: React.ReactNode;
  onClick?: () => void;
}

const AddButton: React.FC<CustomButtonProps> = ({
  text,
  startIcon,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      onClick={onClick}
      sx={{
        bgcolor: "#00A76F",
        borderRadius: 2,
        px: 3,
      }}
    >
      {text}
    </Button>
  );
};

export default AddButton;