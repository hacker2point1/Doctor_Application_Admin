"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

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
  Business,
  Close,
  CurrencyRupee,
} from "@mui/icons-material";

import {
  createDoctor,
  getDepartmentList,
  getDoctorList,
  updateDoctorDetails,
} from "@/redux/slice/doctorCRUDSlice";

interface DoctorForm {
  name: string;
  fees: string;
  departmentId: string;
  startTime: string;
  endTime: string;
  slotDuration: string;
}

const DoctorDetailsUpdate = ({ closeModal, doctorId }: any) => {

  const theme = useTheme();
  const dispatch = useDispatch<any>();

  const { departmentList, doctorList } = useSelector((state: any) => state.doctor);

  const [loading, setLoading] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  const accentColor =
    theme.palette.mode === "light"
      ? "#00A76F"
      : theme.palette.primary.main;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DoctorForm>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required("Name required"),
        fees: yup.string().required("Fees required"),
        departmentId: yup.string().required("Department required"),
        startTime: yup.string().required("Start time required"),
        endTime: yup
          .string()
          .required("End time required")
          .test(
            "is-greater",
            "End time must be after start time",
            function (value) {
              const { startTime } = this.parent;
              return !startTime || !value || value > startTime;
            }
          ),
        slotDuration: yup.string().required("Slot duration is required"),
      })
    ),
  });

  const isEditMode = Boolean(doctorId);

  useEffect(() => {
    dispatch(getDepartmentList({}));

    if (doctorId) {
      dispatch(getDoctorList({ page: 1, limit: 100 }));
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (!doctorId || !departmentList) return;

    const doc = doctorList?.find((d: any) => d._id === doctorId);
    if (!doc) return;

    setValue("name", doc.name);
    setValue("fees", doc.fees);
    setValue("departmentId", doc.departmentId);

    const dept = departmentList.find((d: any) => d._id === doc.departmentId);
    setDepartmentName(dept?.name || "");

    const schedule = doc.schedule || doc.scheduleInfo || doc.schedules;

    let parsedSchedule: any = null;
    if (typeof schedule === "string") {
      try {
        parsedSchedule = JSON.parse(schedule);
      } catch {
        parsedSchedule = null;
      }
    } else {
      parsedSchedule = schedule;
    }

    setValue("startTime", parsedSchedule?.startTime || "");
    setValue("endTime", parsedSchedule?.endTime || "");
    setValue("slotDuration", parsedSchedule?.slotDuration || "");
  }, [doctorId, departmentList, doctorList, setValue]);

  const departmentId = watch("departmentId");

  useEffect(() => {
    if (!departmentId) return;

    const dept = departmentList.find((d: any) => d._id === departmentId);
    setDepartmentName(dept?.name || "");
  }, [departmentId, departmentList]);

  const onSubmit = async (data: DoctorForm) => {

    const payload = {
      name: data.name,
      fees: data.fees,
      departmentId: data.departmentId,
      schedule: {
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: data.slotDuration,
      },
    };

    try {
      setLoading(true);

      if (isEditMode && doctorId) {
        await dispatch(
          updateDoctorDetails({ id: doctorId, data: payload })
        ).unwrap();
        toast.success("Doctor updated successfully!");
      } else {
        await dispatch(createDoctor(payload)).unwrap();
        toast.success("Doctor created successfully!");
      }

      dispatch(getDoctorList({ page: 1, limit: 5 }));
      closeModal();

    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          {isEditMode ? "Edit Doctor" : "Add Doctor"}
        </Typography>

        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          {/* Name */}
          <Box>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: accentColor }}>
              DOCTOR NAME
            </Typography>

            <TextField
              fullWidth
              variant="filled"
              placeholder="Dr. John Doe"
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
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Fees */}
          <Box>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: accentColor }}>
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
                    <CurrencyRupee />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Department */}
          <Box>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: accentColor }}>
              DEPARTMENT
            </Typography>

            {isEditMode ? (
              <TextField
                fullWidth
                variant="filled"
                value={departmentName}
                disabled
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
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
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
                  />
                )}
              />
            )}

            <input type="hidden" {...register("departmentId")} />
          </Box>

          {/* Time Section */}
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
                type="number"
                variant="filled"
                placeholder="Slot Duration (minutes)"
                {...register("slotDuration")}
                error={!!errors.slotDuration}
                helperText={errors.slotDuration?.message}
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
                      Update Doctor
                    </LoadingButton>

        </Stack>
      </Box>
    </Box>
  );
};

export default DoctorDetailsUpdate;





// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useParams } from "next/navigation";

// import {
//   Box,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
//   InputAdornment,
//   Autocomplete,
//   IconButton,
//   useTheme
// } from "@mui/material";

// import { LoadingButton } from "@mui/lab";

// import {
//   Person,
//   LocalHospital,
//   CalendarMonth,
//   AccessTime,
//   Business,
//   Close,
//   CurrencyRupee
// } from "@mui/icons-material";

// import {
//   getDepartmentList,
//   getDoctorList,
//   updateDoctorDetails
// } from "@/redux/slice/doctorCRUDSlice";

// interface DoctorForm {
//   name: string;
//   // specialization: string;
//   fees: string;
//   departmentId: string;
//   date: string;
//   time: string;
// }

// const DoctorDetailsUpdate = ({ closeModal, doctorId: propDoctorId }: any) => {

//   const theme = useTheme();

//   const accentColor =
//     theme.palette.mode === "light"
//       ? "#00A76F"
//       : theme.palette.primary.main;

//   const dispatch = useDispatch<any>();

//   const params = useParams();
//   const doctorId = propDoctorId || (params?.id as string);

//   const { departmentList, doctorList } = useSelector((state: any) => state.doctor);

//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors }
//   } = useForm<DoctorForm>({
//     resolver: yupResolver(
//       yup.object({
//         name: yup.string().required("Name required"),
//         // specialization: yup.string().required("Specialization required"),
//         fees: yup.string().required("Fees required"),
//         departmentId: yup.string().required("Department required"),
//         date: yup.string().required("Date required"),
//         time: yup.string().required("Time required"),
//       })
//     )
//   });

//   useEffect(() => {
//     dispatch(getDepartmentList({}));
//     if (doctorId) {
//       dispatch(getDoctorList({ page: 1, limit: 100 }));
//     }
//   }, [dispatch, doctorId]);

//   useEffect(() => {

//     if (doctorId && doctorList?.length > 0) {

//       const doc = doctorList.find((d: any) => d._id === doctorId);

//       if (doc) {

//         setValue("name", doc.name);
//         // setValue("specialization", doc.specialization);
//         setValue("fees", doc.fees);
//         setValue("departmentId", doc.departmentId);

//         if (doc.availableSlots?.length > 0) {
//           setValue("date", doc.availableSlots[0].date);
//           setValue("time", doc.availableSlots[0].time);
//         }

//       }

//     }

//   }, [doctorId, doctorList, setValue]);

//   const onSubmit = async (data: DoctorForm) => {

//     const payload = {
//       name: data.name,
//       // specialization: data.specialization,
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

//       await dispatch(
//         updateDoctorDetails({ id: doctorId, data: payload })
//       ).unwrap();

//       dispatch(getDoctorList({ page: 1, limit: 5 }));

//       closeModal();

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }

//   };

//   return (

//     <Box sx={{ width: "100%" }}>

//       {/* Header */}

//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         mb={3}
//       >

//         <Typography variant="h6" fontWeight={700}>
//           Edit Doctor
//         </Typography>

//         <IconButton onClick={closeModal}>
//           <Close />
//         </IconButton>

//       </Stack>

//       <Box component="form" onSubmit={handleSubmit(onSubmit)}>

//         <Stack spacing={3}>

//           {/* Doctor Name */}

//           <Box>

//             <Typography
//               variant="caption"
//               sx={{ ml: 1, fontWeight: 700, color: accentColor }}
//             >
//               DOCTOR NAME
//             </Typography>

//             <TextField
//               fullWidth
//               variant="filled"
//               placeholder="e.g. Dr. John Doe"
//               {...register("name")}
//               error={!!errors.name}
//               helperText={errors.name?.message}
//               sx={{
//                 "& .MuiFilledInput-root": {
//                   bgcolor: theme.palette.action.hover,
//                   borderRadius: "12px",
//                   mt: 1
//                 }
//               }}
//               InputProps={{
//                 disableUnderline: true,
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Person sx={{ color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 )
//               }}
//             />

//           </Box>

//           {/* Specialization */}

//           {/* <Box>

//             <Typography
//               variant="caption"
//               sx={{ ml: 1, fontWeight: 700, color: accentColor }}
//             >
//               SPECIALIZATION
//             </Typography>

//             <TextField
//               fullWidth
//               variant="filled"
//               placeholder="e.g. Cardiologist"
//               {...register("specialization")}
//               error={!!errors.specialization}
//               helperText={errors.specialization?.message}
//               sx={{
//                 "& .MuiFilledInput-root": {
//                   bgcolor: theme.palette.action.hover,
//                   borderRadius: "12px",
//                   mt: 1
//                 }
//               }}
//               InputProps={{
//                 disableUnderline: true,
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LocalHospital sx={{ color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 )
//               }}
//             />

//           </Box> */}

//           {/* Fees */}

//           <Box>

//             <Typography
//               variant="caption"
//               sx={{ ml: 1, fontWeight: 700, color: accentColor }}
//             >
//               CONSULTATION FEES
//             </Typography>

//             <TextField
//               fullWidth
//               variant="filled"
//               placeholder="0.00"
//               {...register("fees")}
//               error={!!errors.fees}
//               helperText={errors.fees?.message}
//               sx={{
//                 "& .MuiFilledInput-root": {
//                   bgcolor: theme.palette.action.hover,
//                   borderRadius: "12px",
//                   mt: 1
//                 }
//               }}
//               InputProps={{
//                 disableUnderline: true,
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CurrencyRupee sx={{ color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 )
//               }}
//             />

//           </Box>

//           {/* Department */}

//           {/* <Box>

//             <Typography
//               variant="caption"
//               sx={{ ml: 1, fontWeight: 700, color: accentColor }}
//             >
//               DEPARTMENT
//             </Typography>

//             <Autocomplete
//               options={departmentList || []}
//               getOptionLabel={(option: any) => option.name || ""}
//               onChange={(e, value) => setValue("departmentId", value?._id)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   variant="filled"
//                   placeholder="Select department"
//                   error={!!errors.departmentId}
//                   helperText={errors.departmentId?.message}
//                   sx={{
//                     "& .MuiFilledInput-root": {
//                       bgcolor: theme.palette.action.hover,
//                       borderRadius: "12px",
//                       mt: 1
//                     }
//                   }}
//                   InputProps={{
//                     ...params.InputProps,
//                     disableUnderline: true,
//                     startAdornment: (
//                       <>
//                         <InputAdornment position="start">
//                           <Business sx={{ color: theme.palette.text.secondary }} />
//                         </InputAdornment>
//                         {params.InputProps.startAdornment}
//                       </>
//                     )
//                   }}
//                 />
//               )}
//             />

//           </Box> */}



//           {/* Department */}

// <Box>

//   <Typography
//     variant="caption"
//     sx={{ ml: 1, fontWeight: 700, color: accentColor }}
//   >
//     DEPARTMENT
//   </Typography>

//   <TextField
//     fullWidth
//     variant="filled"
//     value={
//       departmentList.find(
//         (dept: any) =>
//           dept._id ===
//           doctorList.find((d: any) => d._id === doctorId)?.departmentId
//       )?.name || ""
//     }
//     disabled
//     sx={{
//       "& .MuiFilledInput-root": {
//         bgcolor: theme.palette.action.hover,
//         borderRadius: "12px",
//         mt: 1
//       }
//     }}
//     InputProps={{
//       disableUnderline: true,
//       startAdornment: (
//         <InputAdornment position="start">
//           <Business sx={{ color: theme.palette.text.secondary }} />
//         </InputAdornment>
//       )
//     }}
//   />

// </Box>

//           {/* Date + Time */}

//           <Grid container spacing={2}>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 variant="filled"
//                 {...register("date")}
//                 error={!!errors.date}
//                 helperText={errors.date?.message}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 type="time"
//                 variant="filled"
//                 {...register("time")}
//                 error={!!errors.time}
//                 helperText={errors.time?.message}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//           </Grid>

//           {/* Submit */}

//           <LoadingButton
//             fullWidth
//             size="large"
//             type="submit"
//             variant="contained"
//             loading={loading}
//             sx={{
//               py: 1.6,
//               borderRadius: "12px",
//               fontWeight: 700,
//               textTransform: "none",
//               fontSize: "15px",
//               bgcolor: accentColor,
//               "&:hover": { bgcolor: accentColor }
//             }}
//           >
//             Update Doctor
//           </LoadingButton>

//         </Stack>

//       </Box>

//     </Box>

//   );

// };

// export default DoctorDetailsUpdate;