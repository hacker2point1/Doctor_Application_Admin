// 

import React from 'react';
import { Box } from '@mui/material';
import SidebarNavigation from '@/components/sidebarNavigation/sidebarNavigation';


export default function DashboardLayout({ children }) {
  // These widths should match exactly what you have in SidebarNavigation
  const EXPANDED_WIDTH = 280;
  const COLLAPSED_WIDTH = 88;
  
  // Note: In a real app, you'd share the 'isExpanded' state 
  // via Context or Redux to keep these widths synced.
  const isExpanded = true; 

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 1. Sidebar */}
      <SidebarNavigation />

      {/* 2. Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // This tells the box to take up all remaining horizontal space
          width: { 
            sm: `calc(100% - ${isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH}px)` 
          },
          minHeight: '100vh',
          bgcolor: '#f8f9fa', // Matches your dashboard background
        }}
      >
        {children}
      </Box>
    </Box>
  );
}