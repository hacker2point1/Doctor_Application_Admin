"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  Card,
  Divider
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  handleClose: () => void;
  doctor: any;
}

const ViewDoctorModal = ({ open, handleClose, doctor }: Props) => {

  if (!doctor) return null;

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }}
    >

      {/* Header */}

      <DialogTitle sx={{ fontWeight: 700 }}>

        Doctor Details

        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      <Divider />

      <DialogContent>

        {/* Profile Summary */}

        <Typography fontWeight={600} mb={2}>
          Profile Summary:
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3
          }}
        >

          <Stack direction="row" spacing={3} alignItems="center">

            <Avatar
              sx={{
                width: 60,
                height: 60,
                fontSize: 24,
                bgcolor: "#E8F5E9",
                color: "#2E7D32"
              }}
            >
              {doctor.name?.charAt(0)}
            </Avatar>

            <Box flex={1}>

              <Stack direction="row" justifyContent="space-between">

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>

                  <Typography fontWeight={600}>
                    {doctor.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>

                  <Typography fontWeight={500}>
                    Doctor
                  </Typography>
                </Box>

              </Stack>

              <Stack direction="row" justifyContent="space-between" mt={2}>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Specialization
                  </Typography>

                  <Typography>
                    {doctor.specialization}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>

                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: "#E6F6F1",
                      color: "#00A76F",
                      fontWeight: 600
                    }}
                  />
                </Box>

              </Stack>

            </Box>

          </Stack>

        </Card>

        {/* Doctor Info */}

        <Typography fontWeight={600} mb={2}>
          Doctor Info:
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >

          <Stack spacing={2}>

            <Stack direction="row" justifyContent="space-between">

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>

                <Typography fontWeight={500}>
                  {doctor.department?.name || doctor.department || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Consultation Fees
                </Typography>

                <Typography fontWeight={500}>
                  ₹{doctor.fees}
                </Typography>
              </Box>

            </Stack>

            {doctor.email && (

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>

                <Typography>
                  {doctor.email}
                </Typography>
              </Box>

            )}

            {doctor.phone && (

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>

                <Typography>
                  {doctor.phone}
                </Typography>
              </Box>

            )}

            {doctor.experience && (

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Experience
                </Typography>

                <Typography>
                  {doctor.experience} years
                </Typography>
              </Box>

            )}

            {doctor.education && (

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Education
                </Typography>

                <Typography>
                  {doctor.education}
                </Typography>
              </Box>

            )}

          </Stack>

        </Card>

      </DialogContent>

    </Dialog>

  );

};

export default ViewDoctorModal;