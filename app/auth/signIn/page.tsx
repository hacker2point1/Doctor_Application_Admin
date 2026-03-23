"use client";

import React, { useRef, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "@/redux/slice/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Cookies } from "react-cookie";

import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Stack,
  CircularProgress,
  useTheme
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).max(20).required("Password is required"),
});

export default function Login() {

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const cookies = new Cookies();
  const toastShown = useRef(false);
  const searchParams = useSearchParams();
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const loading = useSelector((state: any) => state.auth.loading);

  useEffect(() => {

    const message = searchParams.get("message");

    if (message && !toastShown.current) {
      toast.error("Please Login first");
      toastShown.current = true;
    }

  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {

    const response: any = await dispatch(authLogin(data));

    if (response.payload?.status === true) {

      cookies.set("token", response.payload.token, { path: "/" });

      toast.success(response.payload.message || "Login successful");

      router.push("/dashboard");

    } else {

      toast.error(response.payload?.message || "Login failed");

    }

  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default"
      }}
    >

      {/* LEFT PANEL */}

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          width: { md: "40%", lg: "35%" },
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "#F8F9FA"
        }}
      >

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: "text.primary"
          }}
        >
          Hi, Welcome back
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Manage Your Hospital Management Data
        </Typography>

        <Box
          component="img"
          src="/img/hospital-admin-login.webp"
          alt="Hospital Admin Login"
          sx={{
            width: "100%",
            maxWidth: 350,
            mt: 4
          }}
        />

      </Box>

      {/* RIGHT PANEL */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
          bgcolor: "background.paper"
        }}
      >

        <Box sx={{ width: "100%", maxWidth: 420 }}>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 5,
              color: "text.primary"
            }}
          >
            Sign in to your account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>

            <Stack spacing={3}>

              {/* EMAIL */}

              <TextField
                fullWidth
                label="Email address"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              {/* PASSWORD */}

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">

                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >

                        {showPassword
                          ? <VisibilityOff />
                          : <Visibility />}

                      </IconButton>

                    </InputAdornment>
                  ),
                }}
              />

              {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary"
                  }}
                >
                  Forgot password?
                </Link>

              </Box> */}

              {/* LOGIN BUTTON */}

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark"
                  }
                }}
              >

                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : "Sign in"}

              </Button>

            </Stack>

          </form>

        </Box>

      </Box>

    </Box>

  );

}