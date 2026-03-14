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
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Settings } from "@mui/icons-material";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).max(20).required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cookies = new Cookies();
  const toastShown = useRef(false);
  const searchParams = useSearchParams();

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
      router.push("/doctorCRUD/departmentList");
    } else {
      toast.error(response.payload?.message || "Login failed");
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        overflowX: "hidden",
        display: { md: "flex" },
        justifyContent: "center",
      }}
    >
      {/* LEFT SECTION */}
      <Grid
        item
        xs={false}
        md={4}
        lg={3.5}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8, 
          bgcolor: "#F8F9FA",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mb: 2, color: "#212B36" }}
        >
          Hi, Welcome back
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Manage Your Hospital Management Data
        </Typography>
        <Box
          component="img"
          src="/img/hospital-admin-login.webp"
          alt="Hospital Admin Login"
          sx={{ width: "100%", maxWidth: 350, mt: 4 }}
        />
      </Grid>

      {/* RIGHT SWCTION */}
      <Grid
        item
        xs={12}
        md={8}
        lg={8.5}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          pr: { md: 10, lg: 15 },
          pl: 4,
          py: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 5 }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Sign in to your account
              </Typography>
            </Box>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email address"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Box>
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Link
                    href="#"
                    variant="body2"
                    underline="hover"
                    sx={{ color: "#212B36", fontWeight: 700 }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "#212B36",
                  py: 1.8,
                  borderRadius: 1.5,
                  fontSize: "15px",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#454F5B" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Stack>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}



//with custom css
// "use client";

// import React, { useRef, useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { authLogin } from "@/redux/slice/authSlice";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { Cookies } from "react-cookie";
// import styles from "../signIn/signIn.module.css";
// import { RootState } from "@reduxjs/toolkit/query";

// const schema = yup.object({
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .max(20, "Password cannot exceed 20 characters")
//     .required("Password is required"),
// });

// export default function Login() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const cookies = new Cookies();
//   const toastShown = useRef(false);
//   const searchParams = useSearchParams();
//   const loading = useSelector((state: RootState) => state.auth.loading);

//   useEffect(() => {
//     const message = searchParams.get("message");

//     if (message && !toastShown.current) {
//       toast.error("Please Login first");
//       toastShown.current = true;
//     }
//   }, [searchParams]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: any) => {
//     const response: any = await dispatch(authLogin(data));

//     if (response.payload?.status === true) {
//       cookies.set("token", response.payload.token, { path: "/" });
//       toast.success(response.payload.message || "Login successful");
//       router.push("/doctorCRUD/departmentId");
//     } else {
//       toast.error(response.payload?.message || "Login failed");
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       <div className={styles.formWrapper}>
//         <h1 className={styles.title}>Login</h1>

//         <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
//           <label className={styles.label}>Email</label>
//           <input
//             className={styles.input}
//             placeholder="Enter registered email"
//             {...register("email")}
//           />
//           {errors.email && (
//             <span className={styles.error}>{errors.email.message}</span>
//           )}

//           <label className={styles.label}>Password</label>
//           <input
//             type="password"
//             className={styles.input}
//             placeholder="Enter your password"
//             {...register("password")}
//           />
//           {errors.password && (
//             <span className={styles.error}>{errors.password.message}</span>
//           )}

//           <button type="submit" className={styles.button} disabled={loading}>
//             {loading ? (
//               <>
//                 <span className={styles.spinner}></span> Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

{
  /* <div className={styles.linkText}>
            <Link href="/auth/updatePassword" className={styles.link}>
              Update Password?
            </Link>
          </div>

          <div className={styles.linkText}>
            <Link href="/auth/resetEmail" className={styles.link}>
              Reset Password
            </Link>
          </div> */
}

{
  /* <div className={styles.linkText}>
            <span>Don't have an account? </span>
            <Link href="/auth/signUp" className={styles.link}>
              Register
            </Link>
          </div> */
}
