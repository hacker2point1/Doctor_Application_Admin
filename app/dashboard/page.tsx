import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import BedIcon from '@mui/icons-material/Bed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StatCard = ({ title, value, subtext, icon, color, bgColor }) => (
  <Card sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: bgColor, border: 'none', boxShadow: 'none' }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Avatar sx={{ bgcolor: color, borderRadius: 2, width: 48, height: 48 }}>
        {icon}
      </Avatar>
      <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
    </Box>
    <Box mt={3}>
      <Typography variant="body2" color="text.secondary" fontWeight="500">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="700" sx={{ my: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtext}
      </Typography>
    </Box>
  </Card>
);

const DashboardPage = () => {
  return (
    <Box sx={{ p: { xs: 3, md: 6 }, width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening today.
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Doctors" value="4" subtext="4 Active" icon={<PeopleIcon />} color="#3b82f6" bgColor="#eff6ff" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Departments" value="5" subtext="5 Active" icon={<BusinessIcon />} color="#10b981" bgColor="#ecfdf5" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Beds" value="107" subtext="Available capacity" icon={<BedIcon />} color="#a855f7" bgColor="#f5f3ff" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Patients" value="1,284" subtext="+12.5% this month" icon={<FavoriteIcon />} color="#f97316" bgColor="#fff7ed" />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="700">Recent Activities</Typography>
            <Button size="small" endIcon={<TrendingUpIcon sx={{ transform: 'rotate(45deg)' }} />}>View All</Button>
          </Box>
          <Card sx={{ p: 2, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <List>
              {[
                { label: 'New doctor added', desc: 'Dr. Sarah Johnson • Cardiology', time: '2 hours ago', color: '#10b981' },
                { label: 'Department updated', desc: 'Admin • Neurology', time: '4 hours ago', color: '#3b82f6' },
                { label: 'Doctor status changed', desc: 'Dr. Michael Chen • Neurology', time: '6 hours ago', color: '#f59e0b' }
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30, mt: 1 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 12, color: item.color }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography fontWeight="700">{item.label}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                          <Typography variant="caption" color="text.disabled">{item.time}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < 2 && <Divider variant="inset" component="li" sx={{ ml: 4 }} />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Top Departments */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="700">Top Departments</Typography>
            <Button size="small" endIcon={<TrendingUpIcon sx={{ transform: 'rotate(45deg)' }} />}>View All</Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { name: 'Cardiology', head: 'Dr. Sarah Johnson', count: 8 },
              { name: 'Neurology', head: 'Dr. Michael Chen', count: 6 },
              { name: 'Pediatrics', head: 'Dr. Emily Rodriguez', count: 10 }
            ].map((dept, index) => (
              <Card key={index} sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', borderRadius: 2, mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography fontWeight="700">{dept.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Head: {dept.head}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography fontWeight="700">{dept.count}</Typography>
                  <Typography variant="caption" color="text.secondary">Doctors</Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;