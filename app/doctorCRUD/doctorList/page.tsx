"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

import {
  getDoctorList,
  deleteDoctor,
  getDepartmentList
} from "@/redux/slice/doctorCRUDSlice";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Stack,
  Pagination,
  Skeleton,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import Swal from "sweetalert2";
import { toast } from "sonner";

import CreateDoctorModal from "@/components/modal/addDoctorModal/addDoctorModal";
import EditDoctorModal from "@/components/modal/editDoctorModal/editDoctorModal";
import ViewDoctorModal from "@/components/modal/viewDoctorModal/viewDoctorModal";

import AddButton from "@/components/ui/addButton/addButton";
import { useDebounce } from "@/src/customHooks/useDebounce";

const DoctorList = () => {

  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [viewDoctor, setViewDoctor] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const limit = 5;
  const SIDEBAR_WIDTH = 280;

  const { doctorList, loading, departmentList, totalDoctor } = useSelector(
    (state: RootState) => state.doctor
  );

  const totalPages = totalDoctor > 0 ? Math.ceil(totalDoctor / limit) : (doctorList.length === limit ? page + 1 : page);

  useEffect(() => {
    dispatch(getDepartmentList()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDoctorList({ page, limit, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDoctorId(null);
    setPage(1);
    dispatch(getDoctorList({ page: 1, limit, search: debouncedSearch }));
  };

  const handleDelete = (id: any) => {

    Swal.fire({
      title: "Are you sure?",
      text: "This doctor will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {

      if (result.isConfirmed) {

        dispatch(deleteDoctor(id)).then(() => {
          dispatch(getDoctorList({ page, limit, search: debouncedSearch }));
        });

        toast.success("Doctor deleted successfully");

      }

    });

  };

  const renderLoading = () => (

    [...Array(5)].map((_, index) => (

      <TableRow key={index}>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={60} /></TableCell>
      </TableRow>

    ))

  );

return (

  <Box
    sx={{
      ml: `${SIDEBAR_WIDTH}px`,
      p: 4,
      minHeight: "100vh",
      bgcolor: "background.default",
      filter: openModal || viewDoctor ? "blur(2px)" : "none",
      transition: "filter 0.25s ease",
      pointerEvents: openModal || viewDoctor ? "none" : "auto"
    }}
  >

    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 4 }}
    >

      <Typography variant="h4" fontWeight={700}>
        Doctor Management
        <Typography color="text.secondary">
          Manage all Doctors in the hospital
        </Typography>
      </Typography>

      <AddButton
        text="Add Doctor"
        startIcon={<AddIcon />}
        onClick={() => setOpenModal(true)}
      />

    </Stack>

    <CreateDoctorModal
      open={openModal && !editingDoctorId}
      handleClose={handleCloseModal}
    />

    {editingDoctorId && (

      <EditDoctorModal
        open={openModal}
        doctorId={editingDoctorId}
        handleClose={handleCloseModal}
      />

    )}

    <ViewDoctorModal
      open={Boolean(viewDoctor)}
      doctor={viewDoctor}
      handleClose={() => setViewDoctor(null)}
    />

    <Box sx={{ mb: 3, width: "100%" }}>

      <TextField
        fullWidth
        size="small"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          )
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px"
          }
        }}
      />

    </Box>

    <Card sx={{ borderRadius: 4 }}>

      <TableContainer>

        <Table>

          <TableHead
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "#F4F6F8",
              "& .MuiTableCell-root": {
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "14px",
                letterSpacing: "0.08em",
                color: theme.palette.text.secondary,
                borderBottom: `1px solid ${theme.palette.divider}`
              }
            }}
          >

            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Fees</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {loading ? (

              renderLoading()

            ) : doctorList?.length > 0 ? (

              doctorList.map((doctor: any) => (

                <TableRow key={doctor._id}>

                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "primary.dark"
                              : "#E8F5E9",
                          color:
                            theme.palette.mode === "dark"
                              ? "#fff"
                              : "#2E7D32",
                        }}
                      >
                        {doctor.name.charAt(0)}
                      </Avatar>

                      <Typography fontWeight={600}>
                        {doctor.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {(typeof doctor.department === "string"
                      ? doctor.department
                      : doctor.department?.name) ||
                      departmentList.find(
                        (dept: any) => dept._id === doctor.departmentId
                      )?.name || "N/A"}
                  </TableCell>

                  <TableCell>₹{doctor.fees}</TableCell>

                  {/* ✅ BEAUTIFIED AVAILABILITY */}
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">

                      {(() => {
                        const rawSchedule =
                          doctor.schedule ||
                          doctor.scheduleInfo ||
                          doctor.schedules;

                        let schedule: any = rawSchedule;

                        if (typeof rawSchedule === "string") {
                          try {
                            schedule = JSON.parse(rawSchedule);
                          } catch {
                            schedule = null;
                          }
                        }

                        const chips: string[] = [];

                        if (Array.isArray(schedule)) {
                          schedule.forEach((s: any) => {
                            const start = s.startTime || s.start || s.from;
                            const end = s.endTime || s.end || s.to;
                            if (start || end) {
                              chips.push([start, end].join(" - "));
                            }
                          });
                        } else if (schedule) {
                          const start = schedule.startTime || schedule.start || schedule.from;
                          const end = schedule.endTime || schedule.end || schedule.to;
                          if (start || end) {
                            chips.push([start, end].join(" - "));
                          }
                        }

                        const slots =
                          doctor.availableSlots ||
                          doctor.available_slots ||
                          doctor.slots ||
                          doctor.slot;

                        if (Array.isArray(slots)) {
                          slots.forEach((s: any) => {
                            const start = s.startTime || s.time || s.from;
                            const end = s.endTime || s.to;
                            if (start || end) {
                              chips.push([start, end].join(" - "));
                            }
                          });
                        }

                        if (doctor.startTime || doctor.endTime) {
                          chips.push([doctor.startTime, doctor.endTime].join(" - "));
                        }

                        if (chips.length === 0 && doctor.availability) {
                          chips.push(doctor.availability);
                        }

                        if (chips.length === 0) {
                          return <Typography variant="body2">N/A</Typography>;
                        }

                        return chips.map((time, i) => (
                          <Chip
                            key={i}
                            label={time}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              borderRadius: "8px",
                              bgcolor: "#E8F5E9",
                              color: "#2E7D32"
                            }}
                          />
                        ));
                      })()}

                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">

                      <IconButton
                        color="primary"
                        onClick={() => setViewDoctor(doctor)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        color="warning"
                        onClick={() => {
                          setEditingDoctorId(doctor._id);
                          setOpenModal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doctor._id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                    </Stack>
                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>
                <TableCell colSpan={5} align="center">
                  No doctors found
                </TableCell>
              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}

    </Card>

  </Box>

);
};

export default DoctorList;



// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// import {
//   getDoctorList,
//   deleteDoctor,
//   getDepartmentList
// } from "@/redux/slice/doctorCRUDSlice";

// import AddIcon from "@mui/icons-material/Add";
// import { Edit, Delete } from "@mui/icons-material";

// import {
//   Box,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Button,
//   Avatar,
//   Stack,
//   Pagination,
//   Skeleton,
//   Chip
// } from "@mui/material";

// import { useTheme } from "@mui/material/styles";

// import Swal from "sweetalert2";
// import { toast } from "sonner";

// import CreateDoctorModal from "@/components/modal/addDoctorModal/addDoctorModal";
// import EditDoctorModal from "@/components/modal/editDoctorModal/editDoctorModal";
// import AddButton from "@/components/ui/addButton/addButton";

// import SearchField from "@/components/ui/searchField/searchFiels";
// import { useDebounce } from "@/src/customHooks/useDebounce";

// const DoctorList = () => {

//   const dispatch = useDispatch<any>();
//   const theme = useTheme();

//   const [openModal, setOpenModal] = useState(false);
//   const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//   const debouncedSearch = useDebounce(search, 500);

//   const limit = 5;

//   const SIDEBAR_WIDTH = 280;

//   const { doctorList, loading, departmentList } = useSelector(
//     (state: RootState) => state.doctor
//   );

//   const totalPages = doctorList.length === limit ? page + 1 : page;

//   useEffect(() => {
//     dispatch(getDepartmentList()).unwrap();
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(getDoctorList({ page, limit, search: debouncedSearch }));
//   }, [dispatch, page, debouncedSearch]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     value: number
//   ) => {
//     setPage(value);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setEditingDoctorId(null);
//     setPage(1);
//     dispatch(getDoctorList({ page: 1, limit, search: debouncedSearch }));
//   };

//   const handleDelete = (id: any) => {

//     Swal.fire({
//       title: "Are you sure?",
//       text: "This doctor will be deleted permanently!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!"
//     }).then((result) => {

//       if (result.isConfirmed) {

//         dispatch(deleteDoctor(id)).then(() => {
//           dispatch(getDoctorList({ page, limit, search: debouncedSearch }));
//         });

//         toast.success("Doctor deleted successfully");

//       }

//     });

//   };

//   const renderLoading = () => (

//     [...Array(5)].map((_, index) => (

//       <TableRow key={index}>

//         <TableCell><Skeleton width={120} /></TableCell>
//         <TableCell><Skeleton width={100} /></TableCell>
//         <TableCell><Skeleton width={100} /></TableCell>
//         <TableCell><Skeleton width={60} /></TableCell>
//         <TableCell><Skeleton width={120} /></TableCell>

//       </TableRow>

//     ))

//   );

//   return (

//     <Box
//       sx={{
//         ml: `${SIDEBAR_WIDTH}px`,
//         p: 4,
//         minHeight: "100vh",
//         bgcolor: "background.default"
//       }}
//     >

//       {/* Header */}

//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         sx={{ mb: 4 }}
//       >

//         <Typography variant="h4" fontWeight={700} color="text.primary">
//           Doctor List
//           <Typography color="text.secondary">
//             Manage all Doctors in the hospital
//           </Typography>
//         </Typography>

//         <AddButton
//           text="Add Doctor"
//           startIcon={<AddIcon />}
//           onClick={() => setOpenModal(true)}
//         />

//         <CreateDoctorModal
//           open={openModal && !editingDoctorId}
//           handleClose={handleCloseModal}
//         />

//         {editingDoctorId && (

//           <EditDoctorModal
//             open={openModal}
//             doctorId={editingDoctorId}
//             handleClose={() => {
//               handleCloseModal();
//               setEditingDoctorId(null);
//             }}
//           />

//         )}

//       </Stack>

//       <Card
//         sx={{
//           borderRadius: 4,
//           bgcolor: "background.paper",
//           boxShadow:
//             theme.palette.mode === "dark"
//               ? "0 4px 20px rgba(0,0,0,0.5)"
//               : "0 8px 16px rgba(145,158,171,0.08)"
//         }}
//       >

//         {/* SEARCH */}

//         <Box sx={{ p: 2 }}>

//           <SearchField
//             value={search}
//             placeholder="Search doctor..."
//             onChange={(value) => {
//               setPage(1);
//               setSearch(value);
//             }}
//           />

//         </Box>

//         <TableContainer>

//           <Table>

//             <TableHead
//               sx={{
//                 bgcolor:
//                   theme.palette.mode === "dark"
//                     ? "rgba(255,255,255,0.05)"
//                     : "#F4F6F8"
//               }}
//             >

//               <TableRow>

//                 <TableCell sx={{ fontWeight: 600 }}>
//                   Doctor Name
//                 </TableCell>

//                 <TableCell sx={{ fontWeight: 600 }}>
//                   Specialization
//                 </TableCell>

//                 <TableCell sx={{ fontWeight: 600 }}>
//                   Department
//                 </TableCell>

//                 <TableCell sx={{ fontWeight: 600 }}>
//                   Fees
//                 </TableCell>

//                 <TableCell align="right" sx={{ fontWeight: 600 }}>
//                   Action
//                 </TableCell>

//               </TableRow>

//             </TableHead>

//             <TableBody>

//               {loading ? (

//                 renderLoading()

//               ) : doctorList?.length > 0 ? (

//                 doctorList.map((doctor: any) => (

//                   <TableRow
//                     key={doctor._id}
//                     sx={{
//                       "&:hover": {
//                         bgcolor: "action.hover"
//                       }
//                     }}
//                   >

//                     <TableCell>

//                       <Stack direction="row" spacing={2} alignItems="center">

//                         <Avatar
//                           sx={{
//                             bgcolor:
//                               theme.palette.mode === "dark"
//                                 ? "primary.dark"
//                                 : "#E8F5E9",
//                             color:
//                               theme.palette.mode === "dark"
//                                 ? "#fff"
//                                 : "#2E7D32",
//                           }}
//                         >
//                           {doctor.name.charAt(0)}
//                         </Avatar>

//                         <Typography fontWeight={600}>
//                           {doctor.name}
//                         </Typography>

//                       </Stack>

//                     </TableCell>

//                     <TableCell>

//                       <Chip
//                         label={doctor.specialization}
//                         size="small"
//                         sx={{
//                           bgcolor:
//                             theme.palette.mode === "dark"
//                               ? "rgba(255,255,255,0.1)"
//                               : undefined
//                         }}
//                       />

//                     </TableCell>

//                     <TableCell>

//                       {(typeof doctor.department === "string"
//                         ? doctor.department
//                         : doctor.department?.name) ||

//                         departmentList.find(
//                           (dept: any) => dept._id === doctor.departmentId
//                         )?.name || "N/A"}

//                     </TableCell>

//                     <TableCell>

//                       ₹{doctor.fees}

//                     </TableCell>

//                     <TableCell align="right">

//                       <Stack
//                         direction="row"
//                         spacing={1}
//                         justifyContent="flex-end"
//                       >

//                         <Button
//                           variant="outlined"
//                           size="small"
//                           startIcon={<Edit />}
//                           onClick={() => {
//                             setEditingDoctorId(doctor._id);
//                             setOpenModal(true);
//                           }}
//                         >
//                           Edit
//                         </Button>

//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           startIcon={<Delete />}
//                           onClick={() => handleDelete(doctor._id)}
//                         >
//                           Delete
//                         </Button>

//                       </Stack>

//                     </TableCell>

//                   </TableRow>

//                 ))

//               ) : (

//                 <TableRow>

//                   <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
//                     No doctors found
//                   </TableCell>

//                 </TableRow>

//               )}

//             </TableBody>

//           </Table>

//         </TableContainer>

//         {/* Pagination */}

//         <Box
//           sx={{
//             p: 3,
//             display: "flex",
//             justifyContent: "flex-end"
//           }}
//         >

//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//             shape="rounded"
//           />

//         </Box>

//       </Card>

//     </Box>

//   );

// };

// export default DoctorList;