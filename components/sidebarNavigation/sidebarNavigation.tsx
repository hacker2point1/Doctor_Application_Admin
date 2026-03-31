"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
  Home,
  Logout,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  GroupAdd,
  DomainAdd,
  ScheduleOutlined,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";

import { logoutAdmin } from "@/redux/slice/authSlice";
import { toast } from "sonner";
import { Cookies } from "react-cookie";
import { useThemeMode } from "@/src/theme/themeContext";

const SIDEBAR_WIDTH = 280;

export default function SidebarNavigation() {
  // ------------------- hooks -------------------
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { toggleTheme, mode } = useThemeMode();

  // ------------------- state -------------------
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  // ------------------- hide sidebar on this route -------------------
  if (pathname === "/" || pathname?.startsWith("/auth/signIn")) {
    return null;
  }

  // ------------------- menu config -------------------
  const menuItems = [
    { title: "Home", path: "/dashboard", icon: <Home /> },

    {
      title: "Management",
      icon: <DashboardIcon />,
      children: [
        {
          title: "Department List",
          path: "/doctorCRUD/departmentList",
          icon: <DomainAdd />,
        },
        {
          title: "Doctor List",
          path: "/doctorCRUD/doctorList",
          icon: <GroupAdd />,
        },
      ],
    },

    {
      title: "Appointment Details",
      path: "/doctorCRUD/manageAppoinment",
      icon: <ScheduleOutlined />,
    },

    {
      title: "Accepted Appointments",
      path: "/doctorCRUD/acceptedAppoinments",
      icon: <FileDownloadDoneIcon />,
    },

    {
      title: "Locations",
      path: "/location",
      icon: <AddLocationAltRoundedIcon />,
    },
  ];

  // ------------------- helper functions -------------------
  const normalizePath = (path?: string) => {
    if (!path) return "";
    return "/" + path.replace(/^\/+/, "");
  };

  const isActive = (path?: string) => {
    return pathname === normalizePath(path);
  };

  // ------------------- logout config -------------------
  const handleLogout = async () => {
    const cookies = new Cookies();
    cookies.remove("refreshToken", { path: "/" });

    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logout Successful");
      router.push("/auth/signIn");
    } catch {
      toast.error("Can't Logout now");
    }
  };

  // ------------------- theme colors -------------------
  const sidebarBg =
    mode === "dark"
      ? "linear-gradient(180deg,#1a2a4e,#0f1f3f)"
      : "#ffffff";

  const textColor = mode === "dark" ? "#ffffff" : "#000000";

  const activeColor = "#00A76F";

  const activeBg =
    mode === "dark"
      ? "rgba(0,167,111,0.15)"
      : "rgba(0,167,111,0.08)";

  const drawerContent = (
    <>
      {/* ------------------- logo ------------------- */}
      <Box
        onClick={() => {
          router.push("/dashboard");
          if (!isDesktop) setMobileOpen(false);
        }}
        sx={{
          p: 2,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Box sx={{ position: "relative", height: 60 }}>
          <Image
            src="/img/logo3.png"
            alt="logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* ------------------- menu ------------------- */}
      <Box sx={{ px: 2, flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <React.Fragment key={item.title}>
                  <ListItemButton
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {isMenuOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={isMenuOpen}>
                    <List sx={{ pl: 2 }}>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.path}
                          component={Link}
                          href={child.path!}
                          selected={isActive(child.path)}
                          sx={{
                            color: isActive(child.path)
                              ? activeColor
                              : textColor,
                            bgcolor: isActive(child.path)
                              ? activeBg
                              : "transparent",
                          }}
                          onClick={() => !isDesktop && setMobileOpen(false)}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                href={item.path!}
                selected={isActive(item.path)}
                sx={{
                  color: isActive(item.path) ? activeColor : textColor,
                  bgcolor: isActive(item.path) ? activeBg : "transparent",
                }}
                onClick={() => !isDesktop && setMobileOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* ------------------- theme toggle ------------------- */}
      <Box sx={{ px: 2 }}>
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText
            primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
          />
        </ListItemButton>
      </Box>

      {/* ------------------- profile and logout ------------------- */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <ListItemButton onClick={() => router.push("/auth/profile")}>{/* existing */}
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <DashboardIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                Curewell Admin
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav">
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={isDesktop ? true : mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              background: sidebarBg,
              color: textColor,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}
