
//use client
import React from 'react';
import { Box } from '@mui/material';
import SidebarNavigation from '@/components/sidebarNavigation/sidebarNavigation';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // These widths should match exactly what you have in SidebarNavigation
  const EXPANDED_WIDTH = 280;
  const COLLAPSED_WIDTH = 88;
  
  
  const isExpanded = true; 

  return (
    <Box sx={{ display: 'flex' }}>
      {/*  Sidebar component */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, 
          width: { 
            sm: `calc(100% - ${isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px)` 
          },
          minHeight: '100vh',
          bgcolor: '#f8f9fa', 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}