"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { 
  Box, Drawer, List, ListItemButton, ListItemIcon, 
  ListItemText,  Collapse, 
   Divider, 
} from '@mui/material';
import { 
  Home, Logout, 
 ExpandLess, ExpandMore,
  Dashboard as DashboardIcon,
  GroupAdd,
  DomainAdd,
  ScheduleOutlined
} from '@mui/icons-material';
import { logoutAdmin } from '@/redux/slice/authSlice';
import { toast } from 'sonner';
import { title } from 'process';
import { Cookies } from 'react-cookie';


const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 88;

export default function SidebarNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [openSystem, setOpenSystem] = useState(true);
   const toggleSidebar = () => setIsExpanded(!isExpanded);
const cookies = new Cookies();

  // Configuration for your menu items
  const menuConfig = [
    { title: 'Home', path: '/dashboard', icon: <Home /> },
    {
      title: 'Management',
      icon: <DashboardIcon />,
      children: [
        { title: 'Department List', path: '/doctorCRUD/departmentList', icon: <DomainAdd /> },
        { title: 'Doctor List', path: '/doctorCRUD/doctorList', icon: <GroupAdd /> },
      ]
    },
    {title:'Appoinment Details' , path:'/doctorCRUD/manageAppoinment' , icon:<ScheduleOutlined/>},
  ];

 

  const handleLogout = async () => {
    
    cookies.remove("refreshToken", { path: "/" });
    try {
      await dispatch(logoutAdmin()).unwrap();
      router.push("/auth/signIn");
      toast.success("Logout Succesfull")
     
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Can't Logout now")
      // Cookies already removed
    } 
  };


  return (
    <Box >

    
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px dashed rgba(145, 158, 171, 0.2)',
          transition: (theme) => theme.transitions.create('width', { duration: theme.transitions.duration.shorter })
        },
      }}
    >
      {/* Logo & Toggle */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center' }}>
        <Box component="img" src="/public/img/log-mes" sx={{ width: 32, height: 32 }} />
        {/* <IconButton onClick={toggleSidebar} size="small">
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton> */}
      </Box>

      <Box sx={{ px: 2, flexGrow: 1 }}>
        <List disablePadding>
          {menuConfig.map((item) => {
            // ensure path string starts with a single leading slash
            const normalize = (p?: string) => {
              if (!p) return "";
              const trimmed = p.replace(/^\/+/, "");
              return "/" + trimmed;
            };
            const itemPath = normalize(item.path);

            // Case 1: Item with children (Collapse system)
            if (item.children) {
              return (
                <React.Fragment key={item.title}>
                  <ListItemButton 
                    onClick={() => setOpenSystem(!openSystem)}
                    sx={{ borderRadius: 1.5, mb: 0.5, justifyContent: isExpanded ? 'initial' : 'center' }}
                  >
                    <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 0 }}>{item.icon}</ListItemIcon>
                    {isExpanded && <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />}
                    {isExpanded && (openSystem ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>

                  <Collapse in={openSystem && isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: isExpanded ? 2 : 0 }}>
                      {item.children.map((child) => {
                        const childPath = normalize(child.path);
                        return (
                          <ListItemButton 
                            key={childPath}
                            component={Link}
                            href={childPath}
                            selected={pathname === childPath}
                            sx={{ 
                              borderRadius: 1.5, 
                              mb: 0.5,
                              color: pathname === childPath ? '#00A76F' : 'text.secondary',
                              bgcolor: pathname === childPath ? 'rgba(0, 167, 111, 0.08)' : 'transparent',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.title} primaryTypographyProps={{ fontSize: 13, fontWeight: pathname === childPath ? 700 : 500 }} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            // Case 2: Standard Link (Home or single item)
            return (
              <ListItemButton 
                key={itemPath}
                component={Link}
                href={itemPath}
                selected={pathname === itemPath}
                sx={{ 
                  borderRadius: 1.5, 
                  mb: 0.5, 
                  justifyContent: isExpanded ? 'initial' : 'center',
                  color: pathname === itemPath ? '#00A76F' : 'text.primary',
                  bgcolor: pathname === itemPath ? 'rgba(0, 167, 111, 0.08)' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: isExpanded ? 40 : 0, color: 'inherit' }}>{item.icon}</ListItemIcon>
                {isExpanded && <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Logout - Typically redirects to Login */}
      <Box sx={{ p: 2 }}>
  <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

  <ListItemButton
    onClick={handleLogout}
   
    sx={{
      borderRadius: 1.5,
      color: "error.main",
      justifyContent: isExpanded ? "initial" : "center",
    }}
  >
    <ListItemIcon
      sx={{ minWidth: isExpanded ? 40 : 0, color: "inherit" }}
    >
      <Logout />
    </ListItemIcon>

    {isExpanded && (
      <ListItemText
        primary="Logout"
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    )}
  </ListItemButton>
</Box>
    </Drawer>
    </Box>
  );
}

