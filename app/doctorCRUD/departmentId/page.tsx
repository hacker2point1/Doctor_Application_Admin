"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Typography,
  TextField,
  Stack,
  Card,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  CorporateFare,
  EditNote,
  Close,
} from "@mui/icons-material";

import {
  addDepartment,
  getDepartmentList
} from "@/redux/slice/doctorCRUDSlice";

import { RootState } from "@/redux/store/store";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Department name is required")
    .min(3, "Minimum 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Minimum 5 characters"),
});

interface Props {
  onClose?: () => void;
}

const DepartmentFormModal = ({ onClose }: Props) => {
  const dispatch = useDispatch<any>();
  const { loading } = useSelector((state: RootState) => state.department);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await dispatch(addDepartment(data)).unwrap();

      // refresh department list
      dispatch(getDepartmentList({}));

      // close modal
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "none",
        mx: 0,
        borderRadius: "20px",
        p: 4,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(145,158,171,0.2)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
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
          Add Department
        </Typography>

        {onClose && (
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Stack spacing={3} sx={{ width: "100%" }}>
          
          {/* Department Name */}
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
              DEPARTMENT NAME
            </Typography>

            <TextField
              fullWidth
              variant="filled"
              placeholder="e.g. Cardiology"
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
                    <CorporateFare
                      sx={{ color: "#637381", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Description */}
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
              DESCRIPTION
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              variant="filled"
              placeholder="Enter department description..."
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
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
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  >
                    <EditNote
                      sx={{ color: "#637381", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Submit */}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              width: "100%",
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
            Create Department
          </LoadingButton>
        </Stack>
      </form>
    </Card>
  );
};

export default DepartmentFormModal;