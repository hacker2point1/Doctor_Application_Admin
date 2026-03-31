"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { RootState, AppDispatch } from "@/redux/store/store";
import { createCenter } from "@/redux/slice/location";

export default function AddCenterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.center);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const SIDEBAR_WIDTH = 280;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    dispatch(createCenter(data)).then(() => {
      reset();
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
      sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` } }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "20px",
          width: "100%",
          maxWidth: { xs: "100%", sm: 500, md: 600 },

          
          background: isDark
            ? "linear-gradient(135deg, #1e293b, #0f172a)"
            : "linear-gradient(135deg, #ffffff, #f4f6f8)",

          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",

          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.5)"
            : "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Stack spacing={3}>
          {/* HEADER */}
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: isDark ? "#fff" : "#212B36",
              }}
            >
              Add Center Location
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: isDark ? "#94a3b8" : "text.secondary",
              }}
            >
              Enter details to create a new center
            </Typography>
          </Box>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {/* NAME */}
              <TextField
                label="Center Name"
                {...register("name", { required: "Required" })}
                error={!!errors.name}
                helperText={errors.name?.message as string}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: isDark ? "#0f172a" : "#fff",
                  },
                }}
              />

              {/* ADDRESS */}
              <TextField
                label="Address"
                {...register("address", { required: "Required" })}
                error={!!errors.address}
                helperText={errors.address?.message as string}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: isDark ? "#0f172a" : "#fff",
                  },
                }}
              />

              {/* PHONE */}
              <TextField
                label="Phone"
                {...register("phone", { required: "Required" })}
                error={!!errors.phone}
                helperText={errors.phone?.message as string}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: isDark ? "#0f172a" : "#fff",
                  },
                }}
              />

              {/* LAT LNG */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Latitude"
                  {...register("lat", { required: "Required" })}
                  error={!!errors.lat}
                  helperText={errors.lat?.message as string}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: isDark ? "#0f172a" : "#fff",
                    },
                  }}
                />

                <TextField
                  label="Longitude"
                  {...register("lng", { required: "Required" })}
                  error={!!errors.lng}
                  helperText={errors.lng?.message as string}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: isDark ? "#0f172a" : "#fff",
                    },
                  }}
                />
              </Stack>

              {/* BUTTON */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  height: 48,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.25s ease",

                  background: "#00A76F",
                  color: "#fff",

                  boxShadow: isDark
                    ? "0 4px 14px rgba(0, 167, 111, 0.4)"
                    : "0 4px 14px rgba(0, 167, 111, 0.25)",

                  "&:hover": {
                    background: "#009e68",
                    transform: "translateY(-2px)",
                    boxShadow: isDark
                      ? "0 8px 20px rgba(0, 167, 111, 0.6)"
                      : "0 8px 20px rgba(0, 167, 111, 0.35)",
                  },

                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                  },

                  "&:disabled": {
                    background: "#94a3b8",
                    color: "#e2e8f0",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Saving..." : "Add Center"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}