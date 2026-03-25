"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

import {
  getAppointmentList,
  acceptAppointment,
  rejectAppointment,
} from "@/redux/slice/appointmentSlice";

import { getDoctorList } from "@/redux/slice/doctorCRUDSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Card,
  Box,
  Typography,
  Tooltip,
  Chip,
  Stack,
  Pagination,
  TextField,
  InputAdornment,
  Skeleton,
  useTheme
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SearchIcon from "@mui/icons-material/Search";

import Swal from "sweetalert2";
import { useDebounce } from "@/src/customHooks/useDebounce";

export default function AppointmentList() {
  const SIDEBAR_WIDTH = 280;
  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const { appointmentList, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const { doctorList } = useSelector(
    (state: RootState) => state.doctor
  );

  const [doctorMap, setDoctorMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(getAppointmentList());
    dispatch(getDoctorList({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const map: Record<string, string> = {};
    doctorList?.forEach((doc: any) => {
      map[doc._id] = doc.name;
    });
    setDoctorMap(map);
  }, [doctorList]);

  useEffect(() => {
    setIsSearching(search !== debouncedSearch);
  }, [search, debouncedSearch]);

  const getDoctorName = (doctorId: string) =>
    doctorMap[doctorId] || "Unknown Doctor";

  const filteredAppointments = useMemo(() => {
    let data = appointmentList || [];

    if (debouncedSearch) {
      data = data.filter((appt: any) =>
        appt.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        getDoctorName(appt.doctorId)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    return data;
  }, [appointmentList, debouncedSearch, doctorMap]);

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const isPending = (status: string) =>
    status?.toLowerCase() === "pending";

  const handleAccept = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Confirm",
      text: "Mark this appointment as accepted?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00A76F",
    });

    if (!confirm.isConfirmed) return;

    await dispatch(acceptAppointment(id));
    dispatch(getAppointmentList());
  };

  const handleReject = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Confirm",
      text: "Mark this appointment as rejected?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5630",
    });

    if (!confirm.isConfirmed) return;

    await dispatch(rejectAppointment(id));
    dispatch(getAppointmentList());
  };

  const renderSkeletonRows = () =>
    [...Array(6)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={80} /></TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </TableCell>
      </TableRow>
    ));

  if (loading) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Appointment Requests
          </Typography>
          <Table>
            <TableBody>{renderSkeletonRows()}</TableBody>
          </Table>
        </Card>
      </Box>
    );
  }

  if (!appointmentList?.length) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 6 }}>
          <Stack alignItems="center">
            <EventBusyIcon sx={{ fontSize: 60, color: "#aaa" }} />
            <Typography mt={2}>No Appointments Found</Typography>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Appointment Requests
        </Typography>

        {/* 🔥 MODERN SEARCH BAR */}
        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search patient or doctor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    ✕
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "#F4F6F8",
                transition: "0.3s",
                "& fieldset": { border: "none" },
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "#EEF2F6",
                },
                "&.Mui-focused": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "#fff",
                  boxShadow: "0 0 0 2px rgba(0,167,111,0.2)",
                },
              },
            }}
          />
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isSearching ? (
              renderSkeletonRows()
            ) : paginatedAppointments.length === 0 && debouncedSearch ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Stack alignItems="center">
                    <EventBusyIcon sx={{ fontSize: 40, color: "#bbb" }} />
                    <Typography color="text.secondary">
                      No appointments found for your search
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((appt: any) => (
                <TableRow key={appt._id} hover>
                  <TableCell>{appt.name}</TableCell>
                  <TableCell>{getDoctorName(appt.doctorId)}</TableCell>
                  <TableCell>{appt.date}</TableCell>

                  <TableCell>
                    <Chip
                      label={appt.status}
                      color={
                        appt.status === "accepted"
                          ? "success"
                          : appt.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Accept">
                        <IconButton
                          onClick={() => handleAccept(appt._id)}
                          disabled={!isPending(appt.status)}
                          sx={{
                            "&:hover": {
                              color: "#00A76F",
                              backgroundColor: "rgba(0,167,111,0.1)",
                            },
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reject">
                        <IconButton
                          onClick={() => handleReject(appt._id)}
                          disabled={!isPending(appt.status)}
                          sx={{
                            "&:hover": {
                              color: "#FF5630",
                              backgroundColor: "rgba(255,86,48,0.1)",
                            },
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {filteredAppointments.length > rowsPerPage && (
          <Stack alignItems="flex-end" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, val) => setPage(val)}
            />
          </Stack>
        )}
      </Card>
    </Box>
  );
}
