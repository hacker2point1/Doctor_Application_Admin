"use client";

import {
  Box,
  Typography,
  Avatar,
  Card,
  Stack,
  Chip,
  Divider
} from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export default function ProfilePage() {

  const authState = useSelector((state: RootState) => state.auth) as any;
  const admin = authState?.admin || { name: "Admin", email: "admin@google.com", createdAt: new Date().toISOString() };

  const SIDEBAR_WIDTH = 280;

  return (

    <Box
      sx={{
        ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
        width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        p: 4,
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >

      {/* Page Title */}

      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Profile
        <Typography color="text.secondary">
          View administrator account details
        </Typography>
      </Typography>

      {/* Profile Summary */}

      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: "none",
          mb: 4
        }}
      >

        <Stack spacing={3} alignItems="center">

          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: 40,
              bgcolor: "#E8F5E9",
              color: "#2E7D32"
            }}
          >
            {admin?.name?.charAt(0)}
          </Avatar>

          <Typography variant="h5" fontWeight={700}>
            {admin?.name}
          </Typography>

          <Chip
            label="Administrator"
            sx={{
              bgcolor: "#E6F6F1",
              color: "#00A76F",
              fontWeight: 600
            }}
          />

        </Stack>

      </Card>

      {/* Account Info */}

      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: "none"
        }}
      >

        <Typography fontWeight={600} mb={2}>
          Account Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>

            <Typography fontWeight={500}>
              {admin?.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Role
            </Typography>

            <Typography fontWeight={500}>
              Admin
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Account Created
            </Typography>

            <Typography fontWeight={500}>
              {admin?.createdAt
                ? new Date(admin.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>

        </Stack>

      </Card>

    </Box>

  );

}