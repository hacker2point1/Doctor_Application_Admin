"use client";

import {
  Modal,
  Box,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Card
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const ViewDepartmentModal = ({ open, department, handleClose }: any) => {

  if (!department) return null;

  return (

    <Modal 
      open={open} 
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(5px)",
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }
      }}
    >

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 520,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4
        }}
      >

        {/* Header */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >

          <Typography
            variant="h6"
            fontWeight={700}
            color="success.dark"
          >
            Department Details
          </Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>

        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Summary */}

        <Typography
          fontWeight={600}
          mb={2}
        >
          Department Summary:
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >

          <Stack direction="row" spacing={3}>

            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                fontWeight: 700
              }}
            >
              {department.name.charAt(0)}
            </Avatar>

            <Stack spacing={1} flex={1}>

              <Stack direction="row" justifyContent="space-between">

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Department Name
                  </Typography>

                  <Typography fontWeight={600}>
                    {department.name}
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

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>

                <Typography>
                  {department.description || "No description"}
                </Typography>
              </Box>

            </Stack>

          </Stack>

        </Card>

        {/* Account Info */}

        <Typography fontWeight={600} mb={2}>
          Department Info:
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >

          <Stack direction="row" justifyContent="space-between">

            <Box>
              <Typography variant="caption" color="text.secondary">
                Created On
              </Typography>

              <Typography fontWeight={500}>
                {new Date(department.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Department ID
              </Typography>

              <Typography fontWeight={500}>
                {department._id}
              </Typography>
            </Box>

          </Stack>

        </Card>

      </Box>

    </Modal>

  );

};

export default ViewDepartmentModal;