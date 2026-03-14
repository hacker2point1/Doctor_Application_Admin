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
import { Edit, Delete } from "@mui/icons-material";
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
  Button,
  Avatar,
  Stack,
  Pagination,
  Skeleton,
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";

import Swal from "sweetalert2";
import { toast } from "sonner";

import CreateDoctorModal from "@/components/modal/addDoctorModal/addDoctorModal";
import EditDoctorModal from "@/components/modal/editDoctorModal/editDoctorModal";
import AddButton from "@/components/ui/addButton/addButton";

const DoctorList = () => {

  const dispatch = useDispatch<any>();

  const [openModal, setOpenModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 5;

  const SIDEBAR_WIDTH = 280;

  const { doctorList, loading, departmentList } = useSelector(
    (state: RootState) => state.doctor
  );

  const totalPages = doctorList.length === limit ? page + 1 : page;

  useEffect(() => {
    dispatch(getDepartmentList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDoctorList({ page, limit, search }));
  }, [dispatch, page, search]);

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
    dispatch(getDoctorList({ page: 1, limit, search }));
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
          dispatch(getDoctorList({ page, limit, search }));
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
        <TableCell><Skeleton width={60} /></TableCell>
        <TableCell><Skeleton width={120} /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4, minHeight: "100vh" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Doctor List
          <Typography color="text.secondary">
            Manage all Doctors in the hospital
          </Typography>
        </Typography>

        <AddButton
          text="Add Doctor"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        />

        <CreateDoctorModal
          open={openModal && !editingDoctorId}
          handleClose={handleCloseModal}
        />

        {editingDoctorId && (
          <EditDoctorModal
            open={openModal}
            doctorId={editingDoctorId}
            handleClose={() => {
              handleCloseModal();
              setEditingDoctorId(null);
            }}
          />
        )}
      </Stack>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 16px rgba(145,158,171,0.08)"
        }}
      >

        {/* SEARCH BAR */}
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <TableContainer>
          <Table>

            <TableHead sx={{ bgcolor: "#F4F6F8" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Doctor Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fees</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
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
                        <Avatar sx={{ bgcolor: "#E8F5E9", color: "#2E7D32" }}>
                          {doctor.name.charAt(0)}
                        </Avatar>
                        <Typography fontWeight={600}>
                          {doctor.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={doctor.specialization}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {departmentList.find(
                        (dept: any) => dept._id === doctor.departmentId
                      )?.name || "N/A"}
                    </TableCell>

                    <TableCell>₹{doctor.fees}</TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => {
                            setEditingDoctorId(doctor._id);
                            setOpenModal(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(doctor._id)}
                        >
                          Delete
                        </Button>

                      </Stack>
                    </TableCell>

                  </TableRow>

                ))

              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    No doctors found
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
          />
        </Box>

      </Card>
    </Box>
  );
};

export default DoctorList;