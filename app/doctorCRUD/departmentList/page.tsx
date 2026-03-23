"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteDepartment, getDepartmentList } from "@/redux/slice/doctorCRUDSlice";

import {
  Box,
  Typography,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Skeleton,
  Stack,
  Avatar,
  TextField,
  MenuItem,
  InputAdornment
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import AddDepartmentModal from "@/components/modal/addDepaermentModal/addDepartmentModal";
import ViewDepartmentModal from "@/components/modal/viewDepartmentModal/viewDepartmentModal";

import AddButton from "@/components/ui/addButton/addButton";

import Swal from "sweetalert2";

export default function DepartmentList() {

  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const SIDEBAR_WIDTH = 280;

  const { departmentList, loading } = useSelector(
    (state: RootState) => state.doctor
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [viewDept, setViewDept] = useState<any>(null);

  useEffect(() => {
    dispatch(getDepartmentList({}));
  }, [dispatch]);

  useEffect(() => {
    setPage(0);
  }, [search, departmentFilter]);

  const filteredDepartments = departmentList?.filter((dept: any) => {

    const matchesSearch = search
      ? dept.name?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesDepartment =
      departmentFilter === "all" || dept.name === departmentFilter;

    return matchesSearch && matchesDepartment;

  }) || [];

  const paginatedDepartments = filteredDepartments.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleDelete = (dept: any) => {

    Swal.fire({
      title: "Are you sure?",
      text: "This department will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {

      if (result.isConfirmed) {
        dispatch(deleteDepartment(dept._id));
      }

    });

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
        p: 4,
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >

      {/* HEADER */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >

        <Typography variant="h4" fontWeight={700}>
          Department Management
          <Typography color="text.secondary">
            Manage all departments in the hospital
          </Typography>
        </Typography>

        <AddButton
          text="Add Department"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        />

        <AddDepartmentModal
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />

        <ViewDepartmentModal
          open={Boolean(viewDept)}
          department={viewDept}
          handleClose={() => setViewDept(null)}
        />

      </Stack>

      {/* MODERN SEARCH + FILTER BAR */}

      <Card
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 14px rgba(0,0,0,0.06)"
        }}
      >

        <Stack direction="row" spacing={2} alignItems="center">

          {/* SEARCH */}

          <TextField
            fullWidth
            size="small"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          {/* FILTER */}

          <TextField
            select
            size="small"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            sx={{
              width: 220,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px"
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon sx={{ fontSize: 20 }} />
                </InputAdornment>
              )
            }}
          >

            <MenuItem value="all">All Departments</MenuItem>

            {departmentList?.map((dept: any) => (

              <MenuItem key={dept._id} value={dept.name}>
                {dept.name}
              </MenuItem>

            ))}

          </TextField>

        </Stack>

      </Card>

      {/* TABLE CARD */}

      <Card
        sx={{
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.5)"
              : "0 8px 16px rgba(145,158,171,0.08)"
        }}
      >

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

              <TableCell>Department</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

  {loading ? (

    Array.from(new Array(rowsPerPage)).map((_, index) => (

      <TableRow key={index}>

        <TableCell><Skeleton width="60%" height={30} /></TableCell>
        <TableCell><Skeleton width="80%" height={30} /></TableCell>
        <TableCell><Skeleton width="40%" height={30} /></TableCell>
        <TableCell><Skeleton width="50%" height={30} /></TableCell>
        <TableCell><Skeleton width={80} height={30} /></TableCell>

      </TableRow>

    ))

  ) : filteredDepartments.length === 0 ? (

    <TableRow>
      <TableCell colSpan={5} align="center">
        <Typography sx={{ py: 5, color: "text.secondary" }}>
          No department found. Try with a different name.
        </Typography>
      </TableCell>
    </TableRow>

  ) : (

    paginatedDepartments.map((dept: any) => (

      <TableRow key={dept._id} hover>

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
              {dept.name.charAt(0)}
            </Avatar>

            <Typography fontWeight={600}>
              {dept.name}
            </Typography>

          </Stack>

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
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(0,167,111,0.2)"
                  : "#E6F6F1",
              color: "#00A76F",
              fontWeight: 600
            }}
          />

        </TableCell>

        <TableCell align="right">

          <Stack direction="row" spacing={1} justifyContent="flex-end">

            <IconButton
              color="primary"
              onClick={() => setViewDept(dept)}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => handleDelete(dept)}
            >
              <DeleteIcon />
            </IconButton>

          </Stack>

        </TableCell>

      </TableRow>

    ))

  )}

</TableBody>

        </Table>

        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>

          <TablePagination
            component="div"
            count={filteredDepartments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />

        </Box>

      </Card>

    </Box>

  );

}