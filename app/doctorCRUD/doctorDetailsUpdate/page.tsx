"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "next/navigation";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import { LoadingButton } from "@mui/lab";

import {
  Person,
  LocalHospital,
  AttachMoney,
  CalendarMonth,
  AccessTime,
  Business,
  Close,
} from "@mui/icons-material";

import {
  createDoctor,
  getDepartmentList,
  getDoctorList,
  updateDoctorDetails,
} from "@/redux/slice/doctorCRUDSlice";

interface DoctorForm {
  name: string;
  specialization: string;
  fees: string;
  departmentId: string;
  date: string;
  time: string;
}

const DoctorDetailsUpdate = ({ closeModal, doctorId: propDoctorId }: any) => {
  const dispatch = useDispatch<any>();

  const params = useParams();
  // allow overriding id when used inside a modal via propDoctorId
  const doctorId = propDoctorId || (params?.id as string);

  const { departmentList, doctorList } = useSelector((state: any) => state.doctor);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoctorForm>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required("Name required"),
        specialization: yup.string().required("Specialization required"),
        fees: yup.string().required("Fees required"),
        departmentId: yup.string().required("Department required"),
        date: yup.string().required("Date required"),
        time: yup.string().required("Time required"),
      })
    ),
  });

  useEffect(() => {
    dispatch(getDepartmentList({}));
    if (doctorId) {
      dispatch(getDoctorList({ page: 1, limit: 100 }));
    }
  }, [dispatch, doctorId]);

  // prefill form when doctorList and departmentList loaded
  useEffect(() => {
    if (doctorId && doctorList?.length > 0 && departmentList?.length > 0) {
      const doc = doctorList.find((d: any) => d._id === doctorId);
      if (doc) {
        setValue("name", doc.name);
        setValue("specialization", doc.specialization);
        setValue("fees", doc.fees);
        setValue("departmentId", doc.departmentId);
        if (doc.availableSlots && doc.availableSlots.length > 0) {
          setValue("date", doc.availableSlots[0].date);
          setValue("time", doc.availableSlots[0].time);
        }
      }
    }
  }, [doctorId, doctorList, departmentList, setValue]);

  const onSubmit = async (data: DoctorForm) => {
    const payloadData = {
       
      name: data.name,
      specialization: data.specialization,
      fees: data.fees,
      departmentId: data.departmentId,
      availableSlots: [
        {
          date: data.date,
          time: data.time,
        },
      ],
    };

    try {
      setLoading(true);

      if (doctorId) {
        await dispatch(updateDoctorDetails({ id: doctorId, data: payloadData })).unwrap();
      }

      dispatch(getDoctorList({ page: 1, limit: 5 }));

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
       
        maxWidth:"100%",
        borderRadius: "20px",
        p: 4,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(145,158,171,0.2)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          Edit Doctor
        </Typography>

        {closeModal && (
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        )}
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Doctor Name */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: "#00A76F",
                letterSpacing: 0.5,
              }}
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
                  bgcolor: "rgba(145,158,171,0.08)",
                  borderRadius: "12px",
                  mt: 1,
                },
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#637381", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Specialization */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: "#00A76F",
                letterSpacing: 0.5,
              }}
            >
              SPECIALIZATION
            </Typography>

            <TextField
              fullWidth
              variant="filled"
              placeholder="e.g. Cardiologist"
              {...register("specialization")}
              error={!!errors.specialization}
              helperText={errors.specialization?.message}
              sx={{
                "& .MuiFilledInput-root": {
                  bgcolor: "rgba(145,158,171,0.08)",
                  borderRadius: "12px",
                  mt: 1,
                },
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalHospital sx={{ color: "#637381", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Fees */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: "#00A76F",
                letterSpacing: 0.5,
              }}
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
                  bgcolor: "rgba(145,158,171,0.08)",
                  borderRadius: "12px",
                  mt: 1,
                },
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: "#637381", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Department */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: "#00A76F",
                letterSpacing: 0.5,
              }}
            >
              DEPARTMENT
            </Typography>

            <Autocomplete
              options={departmentList || []}
              getOptionLabel={(option: any) => option.name || ""}
              value={departmentList?.find((dept: any) => dept._id === doctorList?.find((d: any) => d._id === doctorId)?.departmentId) || null}
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
                      bgcolor: "rgba(145,158,171,0.08)",
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
                          <Business
                            sx={{ color: "#637381", fontSize: 20 }}
                          />
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
            <Grid item xs={6} component="div">
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: "#00A76F",
                  letterSpacing: 0.5,
                }}
              >
                DATE
              </Typography>

              <TextField
                fullWidth
                type="date"
                variant="filled"
                {...register("date")}
                error={!!errors.date}
                helperText={errors.date?.message}
                sx={{
                  "& .MuiFilledInput-root": {
                    bgcolor: "rgba(145,158,171,0.08)",
                    borderRadius: "12px",
                    mt: 1,
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth
                        sx={{ color: "#637381", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} component="div">
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: "#00A76F",
                  letterSpacing: 0.5,
                }}
              >
                TIME
              </Typography>

              <TextField
                fullWidth
                type="time"
                variant="filled"
                {...register("time")}
                error={!!errors.time}
                helperText={errors.time?.message}
                sx={{
                  "& .MuiFilledInput-root": {
                    bgcolor: "rgba(145,158,171,0.08)",
                    borderRadius: "12px",
                    mt: 1,
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime
                        sx={{ color: "#637381", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
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
              bgcolor: "#212B36",
              py: 1.6,
              borderRadius: "12px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "15px",
              "&:hover": {
                bgcolor: "#454F5B",
              },
            }}
          >
            Update Details
          </LoadingButton>
        </Stack>
      </Box>
    </Card>
  );
};

export default DoctorDetailsUpdate;


