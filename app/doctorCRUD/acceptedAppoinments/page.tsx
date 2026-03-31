// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// import { getAllAcceptedAppoinmentList, getAppointmentList } from "@/redux/slice/appointmentSlice";
// import { getDoctorList } from "@/redux/slice/doctorCRUDSlice";

// import {
//   Box,
//   Card,
//   Chip,
//   InputAdornment,
//   Pagination,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   useTheme,
//   Skeleton
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import EventBusyIcon from "@mui/icons-material/EventBusy";

// export default function AcceptedAppoinments() {
//   const SIDEBAR_WIDTH = 280;
//   const dispatch = useDispatch<any>();
//   const theme = useTheme();

//   const { acceptedAppoinmentList, appointmentList, loading } = useSelector(
//     (state: RootState) => state.appointment
//   );

//   const { doctorList } = useSelector((state: RootState) => state.doctor);

//   const [doctorMap, setDoctorMap] = useState<Record<string, string>>({});
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [fetchError, setFetchError] = useState<string | null>(null);

//   const rowsPerPage = 8;

//   useEffect(() => {
//     dispatch(getAllAcceptedAppoinmentList())
//       .unwrap()
//       .catch((err: any) => {
//         console.error("Failed to load accepted appointments:", err);
//         setFetchError(typeof err === "string" ? err : err?.message ?? "Unknown error");
//       });

//     dispatch(getDoctorList({ page: 1, limit: 100 }));

//     dispatch(getAppointmentList()).catch(() => {});
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
//     const term = search.trim().toLowerCase();

//     let data = acceptedAppoinmentList || [];

//     if (term) {
//       data = data.filter((appt: any) => {
//         const patientName = String(appt.name || "").toLowerCase();
//         const doctorName = String(getDoctorName(appt.doctorId)).toLowerCase();
//         const date = String(appt.date || "").toLowerCase();

//         return (
//           patientName.includes(term) ||
//           doctorName.includes(term) ||
//           date.includes(term)
//         );
//       });
//     }

//     return data;
//   }, [acceptedAppoinmentList, search, doctorMap]);

//   const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / rowsPerPage));

//   const paginatedAppointments = filteredAppointments.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   const hasAcceptedAppointments = acceptedAppoinmentList?.length > 0;

//   const handlePageChange = (_: unknown, value: number) => {
//     setPage(value);
//   };

//   const renderStatusChip = (status: string) => {
//     const normalized = String(status || "").toLowerCase();

//     if (normalized === "accepted" || normalized === "confirmed") {
//       return <Chip label="Accepted" color="success" size="small" />;
//     }

//     if (normalized === "rejected") {
//       return <Chip label="Rejected" color="error" size="small" />;
//     }

//     return <Chip label={normalized || "Accepted"} color="success" size="small" />;
//   };

//   // ✅ Skeleton Rows
//   const renderSkeletonRows = () =>
//     [...Array(5)].map((_, index) => (
//       <TableRow key={index}>
//         <TableCell><Skeleton width={120} /></TableCell>
//         <TableCell><Skeleton width={140} /></TableCell>
//         <TableCell><Skeleton width={100} /></TableCell>
//         <TableCell><Skeleton width={80} /></TableCell>
//       </TableRow>
//     ));

//   if (loading) {
//     return (
//       <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
//         <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
//           Accepted Appointments
//         </Typography>

//         {/* Search Skeleton */}
//         <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
//           <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 5 }} />
//         </Card>

//         {/* Table Skeleton */}
//         <Card sx={{ p: 3, borderRadius: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><Skeleton width={80} /></TableCell>
//                 <TableCell><Skeleton width={80} /></TableCell>
//                 <TableCell><Skeleton width={80} /></TableCell>
//                 <TableCell><Skeleton width={80} /></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>{renderSkeletonRows()}</TableBody>
//           </Table>
//         </Card>
//       </Box>
//     );
//   }

//   if (fetchError) {
//     return (
//       <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
//         <Card sx={{ p: 6 }}>
//           <Stack alignItems="center" spacing={2}>
//             <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
//             <Typography variant="h6" fontWeight={600}>
//               Unable to load accepted appointments
//             </Typography>
//             <Typography color="text.secondary" sx={{ maxWidth: 480, textAlign: "center" }}>
//               {fetchError}
//             </Typography>
//           </Stack>
//         </Card>
//       </Box>
//     );
//   }

//   if (!hasAcceptedAppointments && !search) {
//     return (
//       <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
//         <Card sx={{ p: 6 }}>
//           <Stack alignItems="center" spacing={2}>
//             <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
//             <Typography variant="h6" fontWeight={600}>
//               No Accepted Appointments Found
//             </Typography>
//             <Typography color="text.secondary">
//               {`Fetched ${acceptedAppoinmentList?.length ?? 0} record(s) from the accepted appointments endpoint.`}
//             </Typography>
//           </Stack>
//         </Card>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4, minHeight: "100vh" }}>
//       <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
//         Accepted Appointments ({filteredAppointments.length})
//       </Typography>

//       <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Search patient, doctor or date..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: "text.secondary" }} />
//               </InputAdornment>
//             )
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "30px"
//             }
//           }}
//         />
//       </Card>

//       <Card sx={{ p: 3, borderRadius: 3 }}>
//         <Table>
//           <TableHead
//             sx={{
//               bgcolor:
//                 theme.palette.mode === "dark"
//                   ? "rgba(255,255,255,0.04)"
//                   : "#F4F6F8",
//               "& .MuiTableCell-root": {
//                 fontWeight: 700,
//                 textTransform: "uppercase",
//                 fontSize: "13px",
//                 letterSpacing: "0.08em",
//                 color: theme.palette.text.secondary,
//                 borderBottom: `1px solid ${theme.palette.divider}`
//               }
//             }}
//           >
//             <TableRow>
//               <TableCell>Patient</TableCell>
//               <TableCell>Doctor</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedAppointments.length === 0 && search ? (
//               <TableRow>
//                 <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
//                   <Typography color="text.secondary" fontWeight={500}>
//                     Search with a different name
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedAppointments.map((appt: any) => (
//                 <TableRow key={appt._id}>
//                   <TableCell>{appt.name || "-"}</TableCell>
//                   <TableCell>{getDoctorName(appt.doctorId)}</TableCell>
//                   <TableCell>{appt.date || "-"}</TableCell>
//                   <TableCell>{renderStatusChip(appt.status)}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>

//         <Stack alignItems="center" sx={{ mt: 3 }}>
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//             color="primary"
//           />
//         </Stack>
//       </Card>
//     </Box>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

import { getAllAcceptedAppoinmentList, getAppointmentList } from "@/redux/slice/appointmentSlice";
import { getDoctorList } from "@/redux/slice/doctorCRUDSlice";

import {
  Box,
  Card,
  Chip,
  InputAdornment,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Skeleton
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function AcceptedAppoinments() {
  const SIDEBAR_WIDTH = 280;
  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const { acceptedAppoinmentList, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const { doctorList } = useSelector((state: RootState) => state.doctor);

  const [doctorMap, setDoctorMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false); // ✅ NEW
  const [page, setPage] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const rowsPerPage = 8;

  useEffect(() => {
    dispatch(getAllAcceptedAppoinmentList())
      .unwrap()
      .catch((err: any) => {
        console.error(err);
        setFetchError(typeof err === "string" ? err : err?.message ?? "Unknown error");
      });

    dispatch(getDoctorList({ page: 1, limit: 100 }));
    dispatch(getAppointmentList()).catch(() => {});
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
  //date and time formatter

  const formatDateTime = (date: string, time?: string) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      if (time && time !== "00:00:000" && time !== "00:00:00") {
        return `${formattedDate} ${time}`;
      }

      const timeFromDate = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `${formattedDate} ${timeFromDate}`;
    } catch (error) {
      return date;
    }
  };

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    let data = acceptedAppoinmentList || [];

    if (term) {
      data = data.filter((appt: any) => {
        const patientName = String(appt.name || "").toLowerCase();
        const doctorName = String(getDoctorName(appt.doctorId)).toLowerCase();
        const date = String(appt.date || "").toLowerCase();

        return (
          patientName.includes(term) ||
          doctorName.includes(term) ||
          date.includes(term)
        );
      });
    }

    return data;
  }, [acceptedAppoinmentList, search, doctorMap]);

  // ✅ Stop skeleton after filtering
  useEffect(() => {
    if (searchLoading) {
      const timer = setTimeout(() => setSearchLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [filteredAppointments]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / rowsPerPage));

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const hasAcceptedAppointments = acceptedAppoinmentList?.length > 0;

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const renderStatusChip = (status: string) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "accepted" || normalized === "confirmed") {
      return <Chip label="Accepted" color="success" size="small" />;
    }

    if (normalized === "rejected") {
      return <Chip label="Rejected" color="error" size="small" />;
    }

    return <Chip label={normalized || "Accepted"} color="success" size="small" />;
  };

  const renderSkeletonRows = () =>
    [...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={140} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={80} /></TableCell>
      </TableRow>
    ));

  if (loading) {
    return (
      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` }, p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Accepted Appointments
        </Typography>

        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 5 }} />
        </Card>

        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
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

  if (fetchError) {
    return (
      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` }, p: { xs: 2, md: 4 } }}>
        <Card sx={{ p: 6 }}>
          <Stack alignItems="center" spacing={2}>
            <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
            <Typography variant="h6" fontWeight={600}>
              Unable to load accepted appointments
            </Typography>
            <Typography color="text.secondary">{fetchError}</Typography>
          </Stack>
        </Card>
      </Box>
    );
  }

  if (!hasAcceptedAppointments && !search) {
    return (
      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` }, p: { xs: 2, md: 4 } }}>
        <Card sx={{ p: 6 }}>
          <Stack alignItems="center" spacing={2}>
            <EventBusyIcon sx={{ fontSize: 70, color: "#9e9e9e" }} />
            <Typography variant="h6">No Accepted Appointments Found</Typography>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` }, p: { xs: 2, md: 4 } }}>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Accepted Appointments ({filteredAppointments.length})
      </Typography>

      <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search patient, doctor or date..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchLoading(true); 
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Card>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {searchLoading ? (
              renderSkeletonRows()
            ) : paginatedAppointments.length === 0 && search ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>Search with a different name</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAppointments.map((appt: any) => (
                <TableRow key={appt._id}>
                  <TableCell>{appt.name}</TableCell>
                  <TableCell>{getDoctorName(appt.doctorId)}</TableCell>
                  <TableCell>{formatDateTime(appt.date, appt.time || appt.timeSlot)}</TableCell>
                  <TableCell>{renderStatusChip(appt.status)}</TableCell>
                </TableRow>
              ))
            )}

          </TableBody>

        </Table>

        {filteredAppointments.length > rowsPerPage && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        )}

      </Card>

    </Box>
  );
}