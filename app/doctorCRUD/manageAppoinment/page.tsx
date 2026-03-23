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
  MenuItem,
  Pagination,
  TextField,
  useTheme,
  InputAdornment,
  Skeleton
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

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
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(getAppointmentList()).unwrap();
    dispatch(getDoctorList({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const map: Record<string, string> = {};
    doctorList?.forEach((doc: any) => {
      map[doc._id] = doc.name;
    });
    setDoctorMap(map);
  }, [doctorList]);

  const getDoctorName = (doctorId: string) => {
    return doctorMap[doctorId] || "Unknown Doctor";
  };

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

    if (statusFilter !== "all") {
      data = data.filter((appt: any) => appt.status === statusFilter);
    }

    return data;

  }, [appointmentList, debouncedSearch, statusFilter, doctorMap]);

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusColor = (status: string) => {
    const normalized = status?.toLowerCase?.();
    if (normalized === "accepted") return "success";
    if (normalized === "rejected") return "error";
    return "warning";
  };

  const getDisplayStatus = (status: string) => {
    const normalized = status?.toLowerCase?.();
    if (normalized === "accepted") return "Confirmed";
    if (normalized === "rejected") return "Rejected";
    return "Pending";
  };

  const isPendingStatus = (status: string) => {
    return status?.toLowerCase?.() === "pending";
  };

  const handleAccept = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Confirm",
      text: "Mark this appointment as accepted?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, accept",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00A76F",
      cancelButtonColor: "#9e9e9e",
    });

    if (!confirm.isConfirmed) return;

    await dispatch(acceptAppointment(id));
    await dispatch(getAppointmentList());
  };

  const handleReject = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Confirm",
      text: "Mark this appointment as rejected?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF5630",
      cancelButtonColor: "#9e9e9e",
    });

    if (!confirm.isConfirmed) return;

    await dispatch(rejectAppointment(id));
    await dispatch(getAppointmentList());
  };

  // Skeleton Rows
  const renderSkeletonRows = () =>
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={140} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={90} /></TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="circular" width={30} height={30} />
          </Stack>
        </TableCell>
      </TableRow>
    ));

  if (loading) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Appointment Requests
          </Typography>

          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: 5 }} />
              <Skeleton variant="rectangular" height={40} width={220} sx={{ borderRadius: 5 }} />
            </Stack>
          </Card>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderSkeletonRows()}</TableBody>
          </Table>
        </Card>
      </Box>
    );
  }

  if (!appointmentList || appointmentList.length === 0) {
    return (
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Card sx={{ p: 6 }}>
          <Stack alignItems="center" spacing={2}>
            <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
            <Typography variant="h6" fontWeight={600}>
              No Appointments Found
            </Typography>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
      <Card sx={{ p: 3 }}>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Appointment Requests
        </Typography>

        <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2}>

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
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                )
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
            />

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                )
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accepted">Confirmed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>

          </Stack>
        </Card>

        <Table>
          <TableHead
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "#F4F6F8"
            }}
          >
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedAppointments.length === 0 && (debouncedSearch || statusFilter !== "all") ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary" fontWeight={500}>
                    No appointments found, search with a different name
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((appointment: any) => (
                <TableRow key={appointment._id} hover>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={getDisplayStatus(appointment.status)}
                      size="small"
                      color={getStatusColor(appointment.status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Accept Appointment">
                        <IconButton
                          onClick={() => handleAccept(appointment._id)}
                          disabled={!isPendingStatus(appointment.status)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reject Appointment">
                        <IconButton
                          onClick={() => handleReject(appointment._id)}
                          disabled={!isPendingStatus(appointment.status)}
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

        <Stack alignItems="flex-end" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
          />
        </Stack>

      </Card>
    </Box>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// import {
//   getAppointmentList,
//   acceptAppointment,
//   rejectAppointment,
// } from "@/redux/slice/appointmentSlice";

// import { getDoctorList } from "@/redux/slice/doctorCRUDSlice";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
//   Card,
//   Box,
//   Typography,
//   CircularProgress,
//   Tooltip,
//   Chip,
//   Stack,
//   MenuItem,
//   Pagination,
//   TextField,
//   useTheme,
//   InputAdornment
// } from "@mui/material";

// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import EventBusyIcon from "@mui/icons-material/EventBusy";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";

// import Swal from "sweetalert2";
// import { useDebounce } from "@/src/customHooks/useDebounce";

// export default function AppointmentList() {

//   const SIDEBAR_WIDTH = 280;
//   const dispatch = useDispatch<any>();
//   const theme = useTheme();

//   const { appointmentList, loading } = useSelector(
//     (state: RootState) => state.appointment
//   );

//   const { doctorList } = useSelector(
//     (state: RootState) => state.doctor
//   );

//   const [doctorMap, setDoctorMap] = useState<Record<string, string>>({});
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 500);
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 6;

//   useEffect(() => {
//     dispatch(getAppointmentList()).unwrap();
//     dispatch(getDoctorList({ page: 1, limit: 100 }));
//   }, [dispatch]);

//   useEffect(() => {

//     const map: Record<string, string> = {};

//     doctorList?.forEach((doc: any) => {
//       map[doc._id] = doc.name;
//     });

//     setDoctorMap(map);

//   }, [doctorList]);

//   const getDoctorName = (doctorId: string) => {
//     return doctorMap[doctorId] || "Unknown Doctor";
//   };

//   const filteredAppointments = useMemo(() => {

//     let data = appointmentList || [];

//     if (debouncedSearch) {

//       data = data.filter((appt: any) =>
//         appt.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//         getDoctorName(appt.doctorId)
//           .toLowerCase()
//           .includes(debouncedSearch.toLowerCase())
//       );

//     }

//     if (statusFilter !== "all") {
//       data = data.filter((appt: any) => appt.status === statusFilter);
//     }

//     return data;

//   }, [appointmentList, debouncedSearch, statusFilter, doctorMap]);

//   const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

//   const paginatedAppointments = filteredAppointments.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   const getStatusColor = (status: string) => {
//     const normalized = status?.toLowerCase?.();
//     if (normalized === "accepted") return "success";
//     if (normalized === "rejected") return "error";
//     return "warning";
//   };

//   const isPendingStatus = (status: string) => {
//     return status?.toLowerCase?.() === "pending";
//   };

//   const handleAccept = async (id: string) => {

//     const confirm = await Swal.fire({
//       title: "Confirm",
//       text: "Mark this appointment as accepted?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, accept",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#00A76F",
//       cancelButtonColor: "#9e9e9e",
//     });

//     if (!confirm.isConfirmed) return;

//     await dispatch(acceptAppointment(id)).unwrap();
//     dispatch(getAppointmentList());

//   };

//   const handleReject = async (id: string) => {

//     const confirm = await Swal.fire({
//       title: "Confirm",
//       text: "Mark this appointment as rejected?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, reject",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#FF5630",
//       cancelButtonColor: "#9e9e9e",
//     });

//     if (!confirm.isConfirmed) return;

//     await dispatch(rejectAppointment(id)).unwrap();
//     dispatch(getAppointmentList());

//   };

//   if (loading) {

//     return (
//       <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
//         <Card sx={{ p: 5, display: "flex", justifyContent: "center" }}>
//           <CircularProgress />
//         </Card>
//       </Box>
//     );

//   }

//   if (!appointmentList || appointmentList.length === 0) {

//     return (
//       <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
//         <Card sx={{ p: 6 }}>
//           <Stack alignItems="center" spacing={2}>
//             <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
//             <Typography variant="h6" fontWeight={600}>
//               No Appointments Found
//             </Typography>
//           </Stack>
//         </Card>
//       </Box>
//     );

//   }

//   return (

//     <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>

//       <Card sx={{ p: 3 }}>

//         <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
//           Appointment Requests
//         </Typography>

//         {/* SEARCH + FILTER */}

//         <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>

//           <Stack direction="row" spacing={2}>

//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search patient or doctor..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: "text.secondary" }} />
//                   </InputAdornment>
//                 )
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "30px"
//                 }
//               }}
//             />

//             <TextField
//               select
//               size="small"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//               sx={{
//                 width: 220,
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "30px"
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FilterListIcon />
//                   </InputAdornment>
//                 )
//               }}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="pending">Pending</MenuItem>
//               <MenuItem value="accepted">Accepted</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </TextField>

//           </Stack>

//         </Card>

//         {/* TABLE */}

//         <Table>

//           <TableHead
//             sx={{
//               bgcolor:
//                 theme.palette.mode === "dark"
//                   ? "rgba(255,255,255,0.04)"
//                   : "#F4F6F8"
//             }}
//           >

//             <TableRow>
//               <TableCell>Patient</TableCell>
//               <TableCell>Doctor</TableCell>
//               <TableCell>Appointment Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>

//           </TableHead>

//           <TableBody>

//             {paginatedAppointments.map((appointment: any) => (

//               <TableRow key={appointment._id} hover>

//                 <TableCell>{appointment.name}</TableCell>

//                 <TableCell>
//                   {getDoctorName(appointment.doctorId)}
//                 </TableCell>

//                 <TableCell>{appointment.date}</TableCell>

//                 <TableCell>

//                   <Chip
//                     label={appointment.status}
//                     size="small"
//                     color={getStatusColor(appointment.status)}
//                     sx={{ fontWeight: 600 }}
//                   />

//                 </TableCell>

//                 <TableCell align="center">

//                   <Stack direction="row" spacing={1} justifyContent="center">

//                     {/* ACCEPT */}

//                     <Tooltip title="Accept Appointment">

//                       <IconButton
//                         onClick={() => handleAccept(appointment._id)}
//                         disabled={!isPendingStatus(appointment.status)}
//                         sx={{
//                           color: "text.secondary",
//                           "&:hover": {
//                             color: "#00A76F",
//                             backgroundColor: "rgba(0,167,111,0.1)"
//                           }
//                         }}
//                       >
//                         <CheckCircleIcon />
//                       </IconButton>

//                     </Tooltip>

//                     {/* REJECT */}

//                     <Tooltip title="Reject Appointment">

//                       <IconButton
//                         onClick={() => handleReject(appointment._id)}
//                         disabled={!isPendingStatus(appointment.status)}
//                         sx={{
//                           color: "text.secondary",
//                           "&:hover": {
//                             color: "#FF5630",
//                             backgroundColor: "rgba(255,86,48,0.1)"
//                           }
//                         }}
//                       >
//                         <CancelIcon />
//                       </IconButton>

//                     </Tooltip>

//                   </Stack>

//                 </TableCell>

//               </TableRow>

//             ))}

//           </TableBody>

//         </Table>

//         {/* PAGINATION */}

//         <Stack alignItems="flex-end" mt={3}>

//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={(e, value) => setPage(value)}
//             shape="rounded"
//           />

//         </Stack>

//       </Card>

//     </Box>

//   );

// }