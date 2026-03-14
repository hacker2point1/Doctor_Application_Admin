"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  getAppointmentList,
  acceptAppointment,
  rejectAppointment,
} from "@/redux/slice/appointmentSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Card,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function AppointmentList() {
  const SIDEBAR_WIDTH = 280;
  const dispatch = useDispatch<any>();

  const { appointmentList, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  useEffect(() => {
    dispatch(getAppointmentList());
  }, [dispatch]);

  const handleAccept = (id: string) => {
    dispatch(acceptAppointment(id));
  };

  const handleReject = (id: string) => {
    dispatch(rejectAppointment(id));
  };

  // Loading UI
  if (loading) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 5, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Card>
      </Box>
    );
  }

  // Empty State UI
  if (!appointmentList || appointmentList.length === 0) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              textAlign: "center",
            }}
          >
            <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e", mb: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              No Appointments Found
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              There are currently no appointment requests.
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
      <Card sx={{ p: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Name</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {appointmentList.map((appointment: any) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.status}</TableCell>

              <TableCell align="center">
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                  onClick={() => handleAccept(appointment._id)}
                  disabled={appointment.status !== "pending"}
                >
                  Accept
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleReject(appointment._id)}
                  disabled={appointment.status !== "pending"}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Card>
    </Box>
  );
}