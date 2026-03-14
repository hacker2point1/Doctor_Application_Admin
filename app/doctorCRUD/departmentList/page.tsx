"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import { RootState } from "@/redux/store";
import { deleteDepartment, getDepartmentList, resetDepartmentState } from "@/redux/slice/doctorCRUDSlice";

import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Skeleton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useRouter } from "next/navigation";
import AddDepartmentModal from "@/components/modal/addDepaermentModal/addDepartmentModal";
import AddButton from "@/components/ui/addButton/addButton";
import Swal from "sweetalert2";

export default function DepartmentList() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const SIDEBAR_WIDTH = 280;

  const { departmentList, loading } = useSelector(
    (state: RootState) => state.doctor
  );


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    
    dispatch(getDepartmentList());
  }, [dispatch]);

  const openMenu = (event: any, dept: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedDept(dept);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };



  const handleDelete = () => {
  if (!selectedDept) return;

  Swal.fire({
    title: "Are you sure?",
    text: "This department will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteDepartment(selectedDept._id));
    }
  });

  closeMenu();
};

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        ml: `${SIDEBAR_WIDTH}px`,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        minHeight: "100vh",
        p: 3,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Department Management
          </Typography>

          <Typography color="text.secondary">
            Manage all departments in the hospital
          </Typography>
        </Box>

        <AddButton
  text="Add Department"
  startIcon={<AddIcon />}
  onClick={() => setOpenAddModal(true)}
/>
        <AddDepartmentModal
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />
      </Box>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
        }}
      >
        <Table stickyHeader>
          {/* Glass Morphism Header */}
          <TableHead sx={{ bgcolor: "#F4F6F8" }}>
            <TableRow
              sx={{
                backdropFilter: "blur(14px)",
                background: "rgba(255,255,255,0.6)",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Skeleton Loader */}
            {loading
              ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width="60%" height={30} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width="80%" height={30} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width="40%" height={30} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width="50%" height={30} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width={30} height={30} />
                  </TableCell>
                </TableRow>
              ))
              : departmentList
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((dept: any) => (
                  <TableRow
                    key={dept._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F9FAFB",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {dept.name}
                    </TableCell>

                    <TableCell>{dept.description}</TableCell>

                    <TableCell>
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          bgcolor: "#E6F6F1",
                          color: "#00A76F",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={(e) => openMenu(e, dept)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TablePagination
          component="div"
          count={departmentList?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>

        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}