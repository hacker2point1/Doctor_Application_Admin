"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Autocomplete,
  IconButton,
  useTheme,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  Person,
  CalendarMonth,
  AccessTime,
  Business,
  Close,
  CurrencyRupee,
} from "@mui/icons-material";

import {
  createDoctor,
  getDepartmentList,
  getDoctorList,
} from "@/redux/slice/doctorCRUDSlice";

interface DoctorForm {
  name: string;
  specialization: string;
  fees: string;
  departmentId: string;
  endTime: string;
  startTime: string;
slotDuration:String;
}

const CreateDoctor = ({ closeModal }: any) => {

  const theme = useTheme();

  const accentColor =
    theme.palette.mode === "light" ? "#00A76F" : theme.palette.primary.main;

  const dispatch = useDispatch<any>();
  const { departmentList } = useSelector((state: any) => state.doctor);

  const [loading, setLoading] = useState(false);

  /* ---------- NEW (TODAY DATE BLOCKER) ---------- */

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoctorForm>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required("Name required"),
        fees: yup.string().required("Fees required"),
        departmentId: yup.string().required("Department required"),
        startTime: yup.string().required("StartTime required"),
        endTime: yup.string().required("EndTime required"),
        slotDuration: yup.string().required("Slot duration is required")
      })
    ),
  });

  useEffect(() => {
    dispatch(getDepartmentList({}));
  }, [dispatch]);

  const onSubmit = async (data: DoctorForm) => {
    const payload = {
      name: data.name,
      fees: data.fees,
      departmentId: data.departmentId,

      schedule: 
        {
          startTime: data.startTime,
          endTime: data.endTime,
          slotDuration :data.slotDuration
        },
      
    };

    try {
      setLoading(true);

      await dispatch(createDoctor(payload)).unwrap();

      dispatch(getDoctorList({ page: 1, limit: 5 }));

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          Add Doctor
        </Typography>

        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          {/* Doctor Name */}
          <Box>
            <Typography
              variant="caption"
              sx={{ ml: 1, fontWeight: 700, color: accentColor }}
            >
              DOCTOR NAME
            </Typography>

            <TextField
              fullWidth
              variant="filled"
              placeholder="e.g. Dr. John Doe"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                "& .MuiFilledInput-root": {
                  bgcolor: theme.palette.action.hover,
                  borderRadius: "12px",
                  mt: 1,
                },
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Fees */}
          <Box>
            <Typography
              variant="caption"
              sx={{ ml: 1, fontWeight: 700, color: accentColor }}
            >
              CONSULTATION FEES
            </Typography>

            <TextField
              fullWidth
              variant="filled"
              placeholder="0.00"
              {...register("fees")}
              error={!!errors.fees}
              helperText={errors.fees?.message}
              sx={{
                "& .MuiFilledInput-root": {
                  bgcolor: theme.palette.action.hover,
                  borderRadius: "12px",
                  mt: 1,
                },
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupee sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Department */}
          <Box>
            <Typography
              variant="caption"
              sx={{ ml: 1, fontWeight: 700, color: accentColor }}
            >
              DEPARTMENT
            </Typography>

            <Autocomplete
              options={departmentList || []}
              getOptionLabel={(option: any) => option.name || ""}
              onChange={(e, value) => setValue("departmentId", value?._id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  placeholder="Select department"
                  error={!!errors.departmentId}
                  helperText={errors.departmentId?.message}
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: theme.palette.action.hover,
                      borderRadius: "12px",
                      mt: 1,
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Business sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Date + Time */}
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                variant="filled"
                {...register("startTime")}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}  // NEW
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                variant="filled"
                {...register("endTime")}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


            <Grid item xs={6}>
              <TextField
                fullWidth
                type="slotDuration"
                variant="filled"
                {...register("slotDuration")}
                error={!!errors.slotDuration}
                helperText={errors.slotDuration?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

          </Grid>

          {/* Submit */}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              py: 1.6,
              borderRadius: "12px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "15px",
              bgcolor: accentColor,
              "&:hover": { bgcolor: accentColor },
            }}
          >
            Create Doctor
          </LoadingButton>

        </Stack>
      </Box>
    </Box>
  );
};

export default CreateDoctor;

//another type of from will open for that you have to also uncomment the modal
// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import {
//   Box,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
//   Autocomplete,
//   IconButton,
//   useTheme,
//   Divider
// } from "@mui/material";

// import { LoadingButton } from "@mui/lab";

// import {
//   Close
// } from "@mui/icons-material";

// import {
//   createDoctor,
//   getDepartmentList,
//   getDoctorList
// } from "@/redux/slice/doctorCRUDSlice";

// interface DoctorForm {
//   name: string;
//   specialization: string;
//   fees: string;
//   departmentId: string;
//   date: string;
//   time: string;
// }

// const schema = yup.object({
//   name: yup.string().required("Name required"),
//   specialization: yup.string().required("Specialization required"),
//   fees: yup.string().required("Fees required"),
//   departmentId: yup.string().required("Department required"),
//   date: yup.string().required("Date required"),
//   time: yup.string().required("Time required"),
// });

// const CreateDoctorForm = ({ closeModal }: any) => {

//   const theme = useTheme();
//   const accentColor =
//     theme.palette.mode === "light" ? "#00A76F" : theme.palette.primary.main;

//   const dispatch = useDispatch<any>();
//   const { departmentList } = useSelector((state: any) => state.doctor);

//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors }
//   } = useForm<DoctorForm>({
//     resolver: yupResolver(schema)
//   });

//   useEffect(() => {
//     dispatch(getDepartmentList({}));
//   }, [dispatch]);

//   const onSubmit = async (data: DoctorForm) => {

//     const payload = {
//       name: data.name,
//       specialization: data.specialization,
//       fees: data.fees,
//       departmentId: data.departmentId,
//       availableSlots: [
//         {
//           date: data.date,
//           time: data.time
//         }
//       ]
//     };

//     try {
//       setLoading(true);

//       await dispatch(createDoctor(payload)).unwrap();

//       dispatch(getDoctorList({ page: 1, limit: 5 }));

//       closeModal();

//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" height="100%">

//       {/* HEADER */}

//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         px={3}
//         py={2}
//       >
//         <Typography fontWeight={700} fontSize={18}>
//           Add Doctor
//         </Typography>

//         <IconButton onClick={closeModal}>
//           <Close />
//         </IconButton>
//       </Stack>

//       <Divider />

//       {/* FORM */}

//       <Box
//         component="form"
//         onSubmit={handleSubmit(onSubmit)}
//         sx={{
//           p: 3,
//           overflowY: "auto"
//         }}
//       >

//         <Stack spacing={3}>

//           <TextField
//             label="Doctor Name"
//             fullWidth
//             {...register("name")}
//             error={!!errors.name}
//             helperText={errors.name?.message}
//           />

//           <TextField
//             label="Specialization"
//             fullWidth
//             {...register("specialization")}
//             error={!!errors.specialization}
//             helperText={errors.specialization?.message}
//           />

//           <TextField
//             label="Consultation Fees"
//             fullWidth
//             {...register("fees")}
//             error={!!errors.fees}
//             helperText={errors.fees?.message}
//           />

//           {/* BETTER DROPDOWN */}

//           <Autocomplete
//             options={departmentList || []}
//             getOptionLabel={(option: any) => option.name}
//             onChange={(e, value) => setValue("departmentId", value?._id)}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Department"
//                 error={!!errors.departmentId}
//                 helperText={errors.departmentId?.message}
//               />
//             )}
//           />

//           <Grid container spacing={2}>

//             <Grid item xs={6}>
//               <TextField
//                 label="Date"
//                 type="date"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 {...register("date")}
//                 error={!!errors.date}
//                 helperText={errors.date?.message}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="Time"
//                 type="time"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 {...register("time")}
//                 error={!!errors.time}
//                 helperText={errors.time?.message}
//               />
//             </Grid>

//           </Grid>

//         </Stack>

//       </Box>

//       <Divider />

//       {/* FOOTER */}

//       <Box p={3}>

//         <LoadingButton
//           fullWidth
//           size="large"
//           type="submit"
//           variant="contained"
//           loading={loading}
//           sx={{
//             borderRadius: "10px",
//             textTransform: "none",
//             fontWeight: 700,
//             bgcolor: accentColor,
//             "&:hover": { bgcolor: accentColor }
//           }}
//         >
//           Create Doctor
//         </LoadingButton>

//       </Box>

//     </Box>
//   );
// };

// export default CreateDoctorForm;

//this is another 

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";

// // MUI Components
// import {
//   Box,
//   Card,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
//   Breadcrumbs,
//   Link as MuiLink,
//   Container,
//   InputAdornment,
//   AppBar,
//   Toolbar,
//   Autocomplete,
// } from "@mui/material";

// import { LoadingButton } from "@mui/lab";

// import {
//   Person,
//   LocalHospital,
//   AttachMoney,
//   CalendarMonth,
//   AccessTime,
//   NotificationsNone,
//   ChevronRight,
//   Business,
// } from "@mui/icons-material";

// import {
//   createDoctor,
//   getDepartmentList,
//   getDoctorList,
// } from "@/redux/slice/doctorCRUDSlice";
// // import { useRouter } from "next/router";

// // Refined Vertical Glassmorphism
// const GLASS_STYLE = {
//   background: "rgba(255, 255, 255, 0.4)",
//   backdropFilter: "blur(30px) saturate(180%)",
//   WebkitBackdropFilter: "blur(30px) saturate(180%)",
//   border: "1px solid rgba(255, 255, 255, 0.3)",
//   boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
//   borderRadius: "32px",
// };

// interface DoctorForm {
//   name: string;
//   specialization: string;
//   fees: string;
//   departmentId: string;
//   date: string;
//   time: string;
// }

// const CreateDoctor = () => {
//   const dispatch = useDispatch<any>();
//   const { departmentList } = useSelector((state: any) => state.doctor);
//   const [loading, setLoading] = useState(false);
//   const [deptLoading, setDeptLoading] = useState(false);

//   const searchParams = useSearchParams();
//   const departmentIdFromURL = searchParams.get("departmentId");
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(
//       yup.object().shape({
//         name: yup.string().required("Full name is required"),
//         specialization: yup.string().required("Specialization is required"),
//         fees: yup.string().required("Fees are required"),
//         departmentId: yup.string().required("Department is required"),
//         date: yup.string().required("Date is required"),
//         time: yup.string().required("Time is required"),
//       }),
//     ),
//   });

//   useEffect(() => {
//     dispatch(getDepartmentList({}));
//   }, [dispatch]);

//   useEffect(() => {
//     if (departmentIdFromURL) setValue("departmentId", departmentIdFromURL);
//   }, [departmentIdFromURL, setValue]);

//   const onSubmit = async (data: DoctorForm) => {
//     const payload = {
//       name: data.name,
//       specialization: data.specialization,
//       fees: data.fees,
//       departmentId: data.departmentId,
//       availableSlots: [
//         {
//           date: data.date,
//           time: data.time,
//         },
//       ],
//     };

//     try {
//       setLoading(true);
//       console.log("Doctor Payload:", payload);

//       await dispatch(createDoctor(payload)).unwrap();
//       router.push("/doctorCRUD/doctorList")
//       // dispatch(getDoctorList({ page: 1, limit: 10 }));
//     } catch (error) {
//       console.log("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#F4F7F9",
//         ml: { md: "280px" },
//         transition: "margin 0.3s ease-in-out",
//       }}
//     >
//       {/* TOP NAV */}
//       <AppBar
//         position="sticky"
//         sx={{
//           bgcolor: "rgba(255,255,255,0.4)",
//           backdropFilter: "blur(20px)",
//           boxShadow: "none",
//           borderBottom: "1px dashed rgba(145,158,171,0.2)",
//           color: "#1C252E",
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
//           <Typography variant="subtitle2" fontWeight={800} color="#00A76F">
//             REGISTRY PORTAL
//           </Typography>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <NotificationsNone sx={{ color: "#637381" }} />
//             <Box
//               component="img"
//               src="https://api-dev-minimal-v510.vercel.app/assets/images/avatars/avatar_25.jpg"
//               sx={{
//                 width: 35,
//                 height: 35,
//                 borderRadius: "50%",
//                 border: "2px solid #00A76F",
//               }}
//             />
//           </Stack>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="md" sx={{ py: 8 }}>
//         {/* Header */}
//         <Stack spacing={1} sx={{ mb: 8 }}>
//           <Typography
//             variant="h3"
//             fontWeight={800}
//             sx={{ color: "#1C252E", letterSpacing: "-0.04em" }}
//           >
//             Add New Doctor
//           </Typography>
//           <Breadcrumbs
//             separator={
//               <Box
//                 sx={{
//                   width: 4,
//                   height: 4,
//                   bgcolor: "#919EAB",
//                   borderRadius: "50%",
//                 }}
//               />
//             }
//           >
//             <MuiLink
//               component={Link}
//               href="/dashboard"
//               underline="hover"
//               color="inherit"
//             >
//               Dashboard
//             </MuiLink>
//             <Typography color="text.primary" fontWeight={600}>
//               Create Registry
//             </Typography>
//           </Breadcrumbs>
//         </Stack>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container spacing={5}>
//             {/* Sidebar Info */}
//             <Grid item xs={12} md={4}>
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ mb: 2, color: "#1C252E" }}
//               >
//                 Professional Profile
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ color: "#637381", lineHeight: 2 }}
//               >
//                 Please provide the doctor's legal name, medical specialization,
//                 and initial availability slots.
//                 <br />
//                 <br />
//                 The department will be used for patient filtering in the main
//                 booking app.
//               </Typography>
//             </Grid>

//             {/* VERTICAL FORM CARD */}
//             <Grid item xs={12} md={8}>
//               <Card sx={{ ...GLASS_STYLE, p: { xs: 4, md: 5 } }}>
//                 <Stack spacing={4}>
//                   {/* Name Section */}
//                   <Box>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         ml: 1,
//                         fontWeight: 800,
//                         color: "#00A76F",
//                         letterSpacing: 1,
//                       }}
//                     >
//                       FULL NAME
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       variant="filled"
//                       placeholder="e.g. Dr. John Doe"
//                       {...register("name")}
//                       error={!!errors.name}
//                       helperText={errors.name?.message as string}
//                       sx={{
//                         "& .MuiFilledInput-root": {
//                           bgcolor: "rgba(145,158,171,0.08)",
//                           borderRadius: "16px",
//                           mt: 1,
//                         },
//                       }}
//                       InputProps={{
//                         disableUnderline: true,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Person sx={{ color: "#637381" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Box>

//                   {/* Specialization Section */}
//                   <Box>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         ml: 1,
//                         fontWeight: 800,
//                         color: "#00A76F",
//                         letterSpacing: 1,
//                       }}
//                     >
//                       SPECIALIZATION
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       variant="filled"
//                       placeholder="e.g. Senior Cardiologist"
//                       {...register("specialization")}
//                       error={!!errors.specialization}
//                       helperText={errors.specialization?.message as string}
//                       sx={{
//                         "& .MuiFilledInput-root": {
//                           bgcolor: "rgba(145,158,171,0.08)",
//                           borderRadius: "16px",
//                           mt: 1,
//                         },
//                       }}
//                       InputProps={{
//                         disableUnderline: true,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <LocalHospital sx={{ color: "#637381" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Box>

//                   {/* Fees Section */}
//                   <Box>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         ml: 1,
//                         fontWeight: 800,
//                         color: "#00A76F",
//                         letterSpacing: 1,
//                       }}
//                     >
//                       CONSULTATION FEES (USD)
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       variant="filled"
//                       placeholder="0.00"
//                       {...register("fees")}
//                       error={!!errors.fees}
//                       sx={{
//                         "& .MuiFilledInput-root": {
//                           bgcolor: "rgba(145,158,171,0.08)",
//                           borderRadius: "16px",
//                           mt: 1,
//                         },
//                       }}
//                       InputProps={{
//                         disableUnderline: true,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <AttachMoney sx={{ color: "#637381" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Box>

//                   {/* Department Section */}
//                   <Box>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         ml: 1,
//                         fontWeight: 800,
//                         color: "#00A76F",
//                         letterSpacing: 1,
//                       }}
//                     >
//                       ASSIGNED DEPARTMENT
//                     </Typography>
//                     <Autocomplete
//                       options={departmentList}
//                       getOptionLabel={(option: any) => option.name || ""}
//                       onChange={(e, value) =>
//                         setValue("departmentId", value?._id)
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           variant="filled"
//                           placeholder="Select unit..."
//                           error={!!errors.departmentId}
//                           helperText={errors.departmentId?.message as string}
//                           sx={{
//                             "& .MuiFilledInput-root": {
//                               bgcolor: "rgba(145,158,171,0.08)",
//                               borderRadius: "16px",
//                               mt: 1,
//                             },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             disableUnderline: true,
//                             startAdornment: (
//                               <>
//                                 <InputAdornment position="start" sx={{ pl: 1 }}>
//                                   <Business sx={{ color: "#637381" }} />
//                                 </InputAdornment>
//                                 {params.InputProps.startAdornment}
//                               </>
//                             ),
//                           }}
//                         />
//                       )}
//                     />
//                   </Box>

//                   {/* Availability Row */}
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={4}>
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           ml: 1,
//                           fontWeight: 800,
//                           color: "#00A76F",
//                           letterSpacing: 1,
//                         }}
//                       >
//                         AVAILABLE DATE
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         type="date"
//                         variant="filled"
//                         {...register("date")}
//                         error={!!errors.date}
//                         sx={{
//                           "& .MuiFilledInput-root": {
//                             bgcolor: "rgba(145,158,171,0.08)",
//                             borderRadius: "16px",
//                             mt: 1,
//                           },
//                         }}
//                         InputProps={{
//                           disableUnderline: true,
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <CalendarMonth sx={{ color: "#637381" }} />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           ml: 1,
//                           fontWeight: 800,
//                           color: "#00A76F",
//                           letterSpacing: 1,
//                         }}
//                       >
//                         START TIME
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         type="time"
//                         variant="filled"
//                         {...register("time")}
//                         error={!!errors.time}
//                         sx={{
//                           "& .MuiFilledInput-root": {
//                             bgcolor: "rgba(145,158,171,0.08)",
//                             borderRadius: "16px",
//                             mt: 1,
//                           },
//                         }}
//                         InputProps={{
//                           disableUnderline: true,
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <AccessTime sx={{ color: "#637381" }} />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     {/* <Grid item xs={12} sm={4}>
//                       <Typography variant="caption" sx={{ ml: 1, fontWeight: 800, color: "#00A76F", letterSpacing: 1 }}>
//                         END TIME
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         type="time"
//                         variant="filled"
//                         {...register("time")}
//                         error={!!errors.time}
//                         sx={{ "& .MuiFilledInput-root": { bgcolor: "rgba(145,158,171,0.08)", borderRadius: "16px", mt: 1 } }}
//                         InputProps={{ disableUnderline: true, startAdornment: <InputAdornment position="start"><AccessTime sx={{ color: "#637381" }} /></InputAdornment> }}
//                       />
//                     </Grid> */}
//                   </Grid>

//                   {/* Submission */}
//                   <Box sx={{ pt: 2 }}>
//                     <LoadingButton
//                       fullWidth
//                       size="large"
//                       type="submit"
//                       variant="contained"
//                       loading={loading}
//                       sx={{
//                         bgcolor: "#1C252E",
//                         borderRadius: "16px",
//                         py: 2,
//                         fontWeight: 700,
//                         textTransform: "none",
//                         fontSize: 17,
//                         boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
//                         "&:hover": { bgcolor: "#00A76F", boxShadow: "none" },
//                       }}
//                     >
//                       Create Doctor
//                     </LoadingButton>

//                     <MuiLink
//                       component={Link}
//                       href="/doctorCRUD/doctorList"
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mt: 3,
//                         color: "#637381",
//                         fontWeight: 700,
//                         textDecoration: "none",
//                         gap: 0.5,
//                         "&:hover": { color: "#1C252E" },
//                       }}
//                     >
//                       See All Doctors <ChevronRight sx={{ fontSize: 18 }} />
//                     </MuiLink>
//                   </Box>
//                 </Stack>
//               </Card>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </Box>
//   );
// };

// export default CreateDoctor;
