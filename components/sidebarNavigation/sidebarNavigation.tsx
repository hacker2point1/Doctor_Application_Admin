"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
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
  const { toggleTheme, mode } = useThemeMode();

  // ------------------- state -------------------
  const [isMenuOpen, setIsMenuOpen] = useState(true);

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

  // ------------------- ui -------------------
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          background: sidebarBg,
          color: textColor,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* ------------------- logo ------------------- */}
      <Box
        onClick={() => router.push("/dashboard")}
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
            // ---------- with children ----------
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
                        >
                          <ListItemIcon>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            // ---------- normal item ----------
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                href={item.path!}
                selected={isActive(item.path)}
                sx={{
                  color: isActive(item.path)
                    ? activeColor
                    : textColor,
                  bgcolor: isActive(item.path)
                    ? activeBg
                    : "transparent",
                }}
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

        <ListItemButton onClick={() => router.push("/auth/profile")}>
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
    </Drawer>
  );
}


// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image"; 
// import { usePathname, useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";

// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider
// } from "@mui/material";

// import { useTheme } from "@mui/material/styles";

// import {
//   Home,
//   Logout,
//   ExpandLess,
//   ExpandMore,
//   Dashboard as DashboardIcon,
//   GroupAdd,
//   DomainAdd,
//   ScheduleOutlined,
//   DarkMode,
//   LightMode
// } from "@mui/icons-material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// import { logoutAdmin } from "@/redux/slice/authSlice";
// import { toast } from "sonner";
// import { Cookies } from "react-cookie";
// import { useThemeMode } from "@/src/theme/themeContext";
// import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
// import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';

// const EXPANDED_WIDTH = 280;
// const COLLAPSED_WIDTH = 88;

// export default function SidebarNavigation() {

//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch<any>();
//   const theme = useTheme();

//   const { toggleTheme, mode } = useThemeMode();

//   const [isExpanded] = useState(true);
//   const [openSystem, setOpenSystem] = useState(true);

//   if (pathname === "/" || pathname?.startsWith("/auth/signIn"))
//     return null;

//   const cookies = new Cookies();

//   const menuConfig = [
//     { title: "Home", path: "/dashboard", icon: <Home /> },
//     {
//       title: "Management",
//       icon: <DashboardIcon />,
//       children: [
//         {
//           title: "Department List",
//           path: "/doctorCRUD/departmentList",
//           icon: <DomainAdd />,
//         },
//         {
//           title: "Doctor List",
//           path: "/doctorCRUD/doctorList",
//           icon: <GroupAdd />,
//         },
//       ],
//     },
//     {
//       title: "Appointment Details",
//       path: "/doctorCRUD/manageAppoinment",
//       icon: <ScheduleOutlined />,
//     },
//     {
//       title: "Accepted appoinments",
//       path: "/doctorCRUD/acceptedAppoinments",
//       icon: <FileDownloadDoneIcon />
//     },
//     {
//       title: "Locations",
//       path: "/location",
//       icon: <AddLocationAltRoundedIcon />
//     }
//   ];

//   const handleLogout = async () => {
//     cookies.remove("refreshToken", { path: "/" });

//     try {
//       await dispatch(logoutAdmin()).unwrap();
//       router.push("/auth/signIn");
//       toast.success("Logout Successful");
//     } catch {
//       toast.error("Can't Logout now");
//     }
//   };

//   const sidebarBg =
//     mode === "dark"
//       ? "linear-gradient(180deg,#1a2a4e,#0f1f3f)"
//       : "#ffffff";

//   const normalText =
//     mode === "dark"
//       ? "#ffffff"
//       : "#000000";

//   const activeColor = "#00A76F";

//   const activeBg =
//     mode === "dark"
//       ? "rgba(0,167,111,0.15)"
//       : "rgba(0,167,111,0.08)";

//   return (
//     <Box>

//       <Drawer
//         variant="permanent"
//         sx={{
//           width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
//             boxSizing: "border-box",
//             background: sidebarBg,
//             color: normalText,
//             borderRight: `1px solid ${theme.palette.divider}`,
//           },
//         }}
//       >

        

//         <Box
//           onClick={() => router.push("/dashboard")}
//           sx={{
//             p: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//           }}
//         >
//           <Box
//             sx={{
//               position: "relative",
//               width: isExpanded ? 180 : 50,
//               height: 60,
//             }}
//           >
//             <Image
//               src="/img/logo3.png" 
//               alt="curewell"
//               fill
//               style={{ objectFit: "contain" }}
//               priority
//             />
//           </Box>
//         </Box>

//         {/* Menu */}

//         <Box sx={{ px: 2, flexGrow: 1 }}>
//           <List disablePadding>

//             {menuConfig.map((item) => {

//               const normalize = (p?: string) => {
//                 if (!p) return "";
//                 const trimmed = p.replace(/^\/+/, "");
//                 return "/" + trimmed;
//               };

//               const itemPath = normalize(item.path);

//               if (item.children) {

//                 return (
//                   <React.Fragment key={item.title}>

//                     <ListItemButton
//                       onClick={() => setOpenSystem(!openSystem)}
//                       sx={{
//                         borderRadius: 2,
//                         mb: 0.5,
//                         color: normalText,
//                       }}
//                     >

//                       <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
//                         {item.icon}
//                       </ListItemIcon>

//                       <ListItemText
//                         primary={item.title}
//                         primaryTypographyProps={{
//                           fontWeight: 600,
//                         }}
//                       />

//                       {openSystem ? <ExpandLess /> : <ExpandMore />}

//                     </ListItemButton>

//                     <Collapse in={openSystem}>
//                       <List component="div" disablePadding sx={{ pl: 2 }}>

//                         {item.children.map((child) => {

//                           const childPath = normalize(child.path);
//                           const active = pathname === childPath;

//                           return (
//                             <ListItemButton
//                               key={childPath}
//                               component={Link}
//                               href={childPath}
//                               selected={active}
//                               sx={{
//                                 borderRadius: 2,
//                                 mb: 0.5,
//                                 color: active ? activeColor : normalText,
//                                 bgcolor: active ? activeBg : "transparent",
//                                 "&:hover": {
//                                   bgcolor: activeBg,
//                                 },
//                               }}
//                             >

//                               <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
//                                 {child.icon}
//                               </ListItemIcon>

//                               <ListItemText primary={child.title} />

//                             </ListItemButton>
//                           );

//                         })}

//                       </List>
//                     </Collapse>

//                   </React.Fragment>
//                 );

//               }

//               const active = pathname === itemPath;

//               return (
//                 <ListItemButton
//                   key={itemPath}
//                   component={Link}
//                   href={itemPath}
//                   selected={active}
//                   sx={{
//                     borderRadius: 2,
//                     mb: 0.5,
//                     color: active ? activeColor : normalText,
//                     bgcolor: active ? activeBg : "transparent",
//                     "&:hover": {
//                       bgcolor: activeBg,
//                     },
//                   }}
//                 >

//                   <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
//                     {item.icon}
//                   </ListItemIcon>

//                   <ListItemText
//                     primary={item.title}
//                     primaryTypographyProps={{
//                       fontWeight: 600,
//                     }}
//                   />

//                 </ListItemButton>
//               );

//             })}

//           </List>
//         </Box>

//         {/* Theme Toggle */}

//         <Box sx={{ px: 2 }}>
//           <ListItemButton onClick={toggleTheme} sx={{ borderRadius: 2 }}>
//             <ListItemIcon sx={{ color: normalText }}>
//               {mode === "dark" ? <LightMode /> : <DarkMode />}
//             </ListItemIcon>

//             <ListItemText
//               primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
//             />
//           </ListItemButton>
//         </Box>

//         {/* Profile + Logout */}

//         <Box sx={{ p: 2 }}>
//           <Divider sx={{ mb: 2 }} />

//           <ListItemButton
//             onClick={() => router.push("/auth/profile")}
//             sx={{
//               borderRadius: 2,
//               mb: 1,
//               color: normalText,
//               "&:hover": { bgcolor: activeBg }
//             }}
//           >
//             <ListItemIcon sx={{ color: "inherit" }}>
//               <AccountCircleIcon />
//             </ListItemIcon>

//             <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600 }} />
//           </ListItemButton>

//           <ListItemButton
//             onClick={handleLogout}
//             sx={{
//               borderRadius: 2,
//               color: theme.palette.error.main,
//             }}
//           >
//             <ListItemIcon sx={{ color: "inherit" }}>
//               <Logout />
//             </ListItemIcon>

//             <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
//           </ListItemButton>

//         </Box>

//       </Drawer>

//     </Box>
//   );
// }