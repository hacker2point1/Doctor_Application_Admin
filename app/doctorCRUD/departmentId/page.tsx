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
  useTheme
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  CorporateFare,
  EditNote,
  Close
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
  const theme = useTheme();

  const accentColor =
    theme.palette.mode === "light"
      ? "#00A76F"
      : "#5B8CFF";

  const { loading } = useSelector(
    (state: RootState) => state.department
  );

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

      dispatch(getDepartmentList({}));

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
        borderRadius: "20px",
        p: 4,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[6],
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

      <form onSubmit={handleSubmit(onSubmit)}>

        <Stack spacing={3}>

          {/* Department Name */}

          <Box>

            <Typography
              variant="caption"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: accentColor,
                letterSpacing: 0.5
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
                  bgcolor: theme.palette.action.hover,
                  borderRadius: "12px",
                  mt: 1
                }
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <CorporateFare
                      sx={{ color: theme.palette.text.secondary }}
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
                color: accentColor,
                letterSpacing: 0.5
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
                  bgcolor: theme.palette.action.hover,
                  borderRadius: "12px",
                  mt: 1
                }
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  >
                    <EditNote
                      sx={{ color: theme.palette.text.secondary }}
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
              py: 1.6,
              borderRadius: "12px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "15px",
              bgcolor: accentColor,
              "&:hover": {
                bgcolor: accentColor
              }
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