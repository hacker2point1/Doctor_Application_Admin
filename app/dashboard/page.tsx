"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";

import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  Button,
  Chip,
  Skeleton,
  useTheme
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import DomainIcon from "@mui/icons-material/Domain";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import EventIcon from "@mui/icons-material/Event";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import AnimatedCounter from "@/components/ui/animatedCounter/animatedCounter";

import {
  getDoctorList,
  getDepartmentList
} from "@/redux/slice/doctorCRUDSlice";

import { acceptAppointment, getAppointmentList, getAllAcceptedAppoinmentList } from "@/redux/slice/appointmentSlice";
import { useAppDispatch } from "@/redux/appDispatchTypeHook/hooks";

const SIDEBAR_WIDTH = 280;

export default function DashboardPage() {

  const dispatch = useDispatch<AppDispatch>();
  // const dispatch = useAppDispatch()
  const router = useRouter();
  const theme = useTheme();

  const { doctorList, departmentList} = useSelector(
    (state: RootState) => state.doctor
  );

  const { appointmentList , loading, acceptedAppoinmentList} = useSelector(
    (state: RootState) => state.appointment
  );

//   const [doctorMap, setDoctorMap] = useState<{ [key: string]: string }>({});

//   //doctorName and the paitentName --checked
// useEffect(() => {
//   if (!doctorList) return;

//   const newDoctorMap: { [key: string]: string } = {};

//   for (let i = 0; i < doctorList.length; i++) {
//     const doctor = doctorList[i];

//     const doctorId = doctor._id;
//     const doctorName = doctor.name;

//     newDoctorMap[doctorId] = doctorName;
//   }

//   setDoctorMap(newDoctorMap);
// }, [doctorList]);





const doctorMap = useMemo(() => {
  if (!doctorList) return {};

  const map: { [key: string]: string } = {};
  for (const doc of doctorList) {
    map[doc._id] = doc.name;
  }
  return map;
}, [doctorList]);

  const getDoctorName = (doctorId: string) =>
    doctorMap[doctorId] || "Unknown Doctor";
  useEffect(() => {
    dispatch(getDoctorList({ page: 1, limit: 100 }));
    dispatch(getDepartmentList(undefined));
    dispatch(getAppointmentList({}));
    dispatch(getAllAcceptedAppoinmentList());
   
    
  }, [dispatch]);


  //total appointments
  const totalAppointments = appointmentList?.length || 0;

  //acccepted appointment 
  const acceptedAppointments = acceptedAppoinmentList?.length || 0;


  /* dashboard cards */

  const statCards = [
    {
      title: "Total Doctors",
      value: doctorList?.length || 0,
      icon: <GroupIcon />,
      color: "#3B82F6"
    },
    {
      title: "Departments",
      value: departmentList?.length || 0,
      icon: <DomainIcon />,
      color: "#10B981"
    },
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: <EventIcon />,
      color: "#F97316"
    },
    {
      title: "Accepted Appointments",
      value: acceptedAppointments,
      icon: <MonitorHeartIcon />,
      color: "#8B5CF6"
    }
  ];

  const getStatusColor = (status: string) => {
    const statusColor = status?.toLowerCase();
    if (statusColor === "accepted") return "success";
    if (statusColor === "rejected") return "error";
    return "warning";
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        pt: { xs: "80px", md: 4 },
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Dashboard Overview
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening today.
      </Typography>

      {/* ---------------- STAT CARDS ---------------- */}

      <Stack direction="row" spacing={3} justifyContent="space-between" sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              borderRadius: 4,
              p: 3,
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${card.color}30 0%, rgba(30,41,59,0.9) 100%)`
                  : `linear-gradient(135deg, ${card.color}25 0%, rgba(255,255,255,0.8) 100%)`,
              backdropFilter: "blur(12px)",
              border:
                theme.palette.mode === "dark"
                  ? "none"
                  : "1px solid rgba(255,255,255,0.4)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 10px 40px rgba(0,0,0,0.6)"
                  : "0 10px 40px rgba(145,158,171,0.15)"
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                  {loading
                    ? <Skeleton width={60} height={35}/>
                    : <AnimatedCounter value={card.value}/>}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  bgcolor: card.color,
                  color: "#fff",
                  width: 52,
                  height: 52
                }}
              >
                {card.icon}
              </Avatar>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* ---------------- RECENT APPOINTMENTS ---------------- */}

      <Card sx={{ borderRadius: 4, p: 3, mb: 4 }}>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>

          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon color="primary"/>
            <Typography fontWeight={700} variant="h6">
              Recent Appointments
            </Typography>
          </Stack>

          <Button size="small" onClick={()=>router.push("/doctorCRUD/manageAppoinment")}>
            View All
          </Button>

        </Stack>

        {loading ? (

          <Stack spacing={2}>
            {[1,2,3,4].map((i)=>(
              <Stack key={i} direction="row" justifyContent="space-between" sx={{p:2}}>
                <Box>
                  <Skeleton width={150} height={20}/>
                  <Skeleton width={120} height={16}/>
                </Box>
                <Skeleton width={80} height={28}/>
              </Stack>
            ))}
          </Stack>

        ) : appointmentList.length === 0 ? (

          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary"
            }}
          >
            <EventBusyIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />

            <Typography variant="body1" fontWeight={500}>
              No appointments found today
            </Typography>

            <Typography variant="body2">
              All schedules are clear for now.
            </Typography>
          </Box>

        ) : (

          <Stack spacing={2}>

            {appointmentList.slice(0,4).map((appt:any)=>(

              <Stack
                key={appt._id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p:2,
                  borderRadius:2,
                  bgcolor:
                    theme.palette.mode==="dark"
                      ? "rgba(255,255,255,0.05)"
                      : "#F9FAFB"
                }}
              >

                <Box>
                  <Typography fontWeight={600}>
                    {appt.name || appt.patientName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {appt.doctorName || getDoctorName(appt.doctorId)}
                  </Typography>
                </Box>

                <Chip
                  label={appt.status}
                  size="small"
                  color={getStatusColor(appt.status)}
                />

              </Stack>

            ))}

          </Stack>

        )}

      </Card>

      {/* ---------------- DOCTORS + DEPARTMENTS ---------------- */}

      <Stack direction="row" spacing={3}>

        <Card sx={{flex:1,borderRadius:4,p:3}}>

          <Stack direction="row" justifyContent="space-between" sx={{mb:2}}>
            <Typography fontWeight={700} variant="h6">
              Recent Doctors
            </Typography>
            <Button size="small" onClick={()=>router.push("/doctorCRUD/doctorList")}>
              View All
            </Button>
          </Stack>

          <Stack spacing={2}>

            {loading
              ? [1,2,3,4].map((i)=>(
                <Box key={i} sx={{p:2}}>
                  <Skeleton width={160} height={20}/>
                  <Skeleton width={120} height={16}/>
                </Box>
              ))
              : doctorList.slice(0,4).map((doc:any)=>{

                const departmentName =
                  doc.department?.name ||
                  departmentList.find((d:any)=>d._id===doc.departmentId)?.name ||
                  "Unknown Department";

                return(

                  <Box
                    key={doc._id}
                    sx={{
                      p:2,
                      borderRadius:2,
                      bgcolor:
                        theme.palette.mode==="dark"
                          ? "rgba(255,255,255,0.05)"
                          : "#F9FAFB"
                    }}
                  >

                    <Typography fontWeight={600}>
                      {doc.name}
                    </Typography>

                    <Typography variant="body2" sx={{color:"#00A76F",fontWeight:500}}>
                      {departmentName}
                    </Typography>

                  </Box>

                )

              })
            }

          </Stack>

        </Card>

        <Card sx={{flex:1,borderRadius:4,p:3}}>

          <Stack direction="row" justifyContent="space-between" sx={{mb:2}}>
            <Typography fontWeight={700} variant="h6">
              Top Departments
            </Typography>
            <Button size="small" onClick={()=>router.push("/doctorCRUD/departmentList")}>
              View All
            </Button>
          </Stack>

          <Stack spacing={2}>

            {loading
              ? [1,2,3,4,5].map((i)=>(
                <Stack key={i} direction="row" justifyContent="space-between" sx={{p:2}}>
                  <Skeleton width={140} height={20}/>
                  <Skeleton width={90} height={28}/>
                </Stack>
              ))
              : departmentList.slice(0,5).map((dept:any)=>{

                const doctorCount = doctorList.filter(
                  (d:any)=>d.departmentId===dept._id
                ).length;

                return(

                  <Stack
                    key={dept._id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p:2,
                      borderRadius:2,
                      bgcolor:
                        theme.palette.mode==="dark"
                          ? "rgba(255,255,255,0.05)"
                          : "#F9FAFB"
                    }}
                  >

                    <Typography fontWeight={600}>
                      {dept.name}
                    </Typography>

                    <Chip
                      label={`${doctorCount} Doctors`}
                      size="small"
                      sx={{
                        bgcolor:"rgba(0,167,111,0.12)",
                        color:"#00A76F",
                        fontWeight:600
                      }}
                    />

                  </Stack>

                )

              })
            }

          </Stack>

        </Card>

      </Stack>

    </Box>
  );
}



//with chart analysis

// "use client";

// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// import {
//   Box,
//   Card,
//   Typography,
//   Stack,
//   Chip,
//   Avatar,
//   useTheme
// } from "@mui/material";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";

// import EventIcon from "@mui/icons-material/Event";
// import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

// export default function DashboardWidgets() {

//   const theme = useTheme();

//   const { appointmentList } = useSelector(
//     (state: RootState) => state.appointment
//   );

//   const { doctorList } = useSelector(
//     (state: RootState) => state.doctor
//   );

//   // TODAY APPOINTMENTS
//   const todayAppointments = useMemo(() => {

//     const today = new Date().toDateString();

//     return appointmentList.filter((a: any) =>
//       new Date(a.createdAt).toDateString() === today
//     );

//   }, [appointmentList]);


//   // WEEKLY DATA FOR CHART
//   const weeklyData = useMemo(() => {

//     const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

//     const data = days.map(day => ({
//       name: day,
//       appointments: 0
//     }));

//     appointmentList.forEach((a: any) => {

//       const d = new Date(a.createdAt).getDay();

//       data[d].appointments += 1;

//     });

//     return data;

//   }, [appointmentList]);


//   // DOCTOR AVAILABILITY
//   const availableDoctors = doctorList.filter((d:any)=>d.isAvailable !== false);
//   const unavailableDoctors = doctorList.length - availableDoctors.length;

//   const cardBg =
//     theme.palette.mode === "dark"
//       ? "rgba(255,255,255,0.05)"
//       : "#F9FAFB";

//   return (

//     <Stack spacing={3} sx={{mt:4}}>

//       {/* TOP WIDGETS */}

//       <Stack direction="row" spacing={3} flexWrap="wrap">

//         {/* APPOINTMENT CHART */}

//         <Card
//           sx={{
//             flex:"2 1 600px",
//             p:3,
//             borderRadius:4,
//             bgcolor: theme.palette.background.paper
//           }}
//         >

//           <Stack direction="row" spacing={1} alignItems="center" sx={{mb:2}}>

//             <EventIcon color="primary"/>

//             <Typography variant="h6" fontWeight={700}>
//               Weekly Appointments
//             </Typography>

//           </Stack>

//           <Box height={300}>

//             <ResponsiveContainer width="100%" height="100%">

//               <BarChart data={weeklyData}>

//                 <XAxis dataKey="name"/>

//                 <YAxis/>

//                 <Tooltip/>

//                 <Bar
//                   dataKey="appointments"
//                   radius={[6,6,0,0]}
//                 />

//               </BarChart>

//             </ResponsiveContainer>

//           </Box>

//         </Card>


//         {/* DOCTOR AVAILABILITY */}

//         <Card
//           sx={{
//             flex:"1 1 300px",
//             p:3,
//             borderRadius:4,
//             bgcolor: theme.palette.background.paper
//           }}
//         >

//           <Stack direction="row" spacing={1} alignItems="center" sx={{mb:2}}>

//             <MonitorHeartIcon color="success"/>

//             <Typography variant="h6" fontWeight={700}>
//               Doctor Availability
//             </Typography>

//           </Stack>

//           <Stack spacing={2}>

//             <Stack direction="row" justifyContent="space-between">

//               <Typography>Available</Typography>

//               <Chip
//                 label={availableDoctors.length}
//                 color="success"
//               />

//             </Stack>

//             <Stack direction="row" justifyContent="space-between">

//               <Typography>Unavailable</Typography>

//               <Chip
//                 label={unavailableDoctors}
//                 color="error"
//               />

//             </Stack>

//             <Stack direction="row" justifyContent="space-between">

//               <Typography>Total Doctors</Typography>

//               <Chip label={doctorList.length}/>

//             </Stack>

//           </Stack>

//         </Card>

//       </Stack>


//       {/* TODAY APPOINTMENTS */}

//       <Card
//         sx={{
//           p:3,
//           borderRadius:4,
//           bgcolor: theme.palette.background.paper
//         }}
//       >

//         <Typography variant="h6" fontWeight={700} sx={{mb:2}}>
//           Today's Appointments
//         </Typography>

//         {todayAppointments.length === 0 ? (

//           <Typography color="text.secondary">
//             No appointments today
//           </Typography>

//         ) : (

//           <Stack spacing={2}>

//             {todayAppointments.slice(0,5).map((a:any)=>(
              
//               <Stack
//                 key={a._id}
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{
//                   p:2,
//                   borderRadius:2,
//                   bgcolor: cardBg
//                 }}
//               >

//                 <Stack direction="row" spacing={2} alignItems="center">

//                   <Avatar>
//                     {a.name?.charAt(0) || "P"}
//                   </Avatar>

//                   <Box>

//                     <Typography fontWeight={600}>
//                       {a.name || a.patientName}
//                     </Typography>

//                     <Typography variant="body2" color="text.secondary">
//                       {a.doctorName}
//                     </Typography>

//                   </Box>

//                 </Stack>

//                 <Chip
//                   label={a.status}
//                   size="small"
//                   color={
//                     a.status==="accepted"
//                       ?"success"
//                       :a.status==="rejected"
//                       ?"error"
//                       :"warning"
//                   }
//                 />

//               </Stack>

//             ))}

//           </Stack>

//         )}

//       </Card>


//       {/* WEEKLY ANALYTICS */}

//       <Card
//         sx={{
//           p:3,
//           borderRadius:4,
//           bgcolor: theme.palette.background.paper
//         }}
//       >

//         <Typography variant="h6" fontWeight={700} sx={{mb:2}}>
//           Weekly Analytics
//         </Typography>

//         <Stack direction="row" spacing={3} flexWrap="wrap">

//           <Chip
//             label={`Total Appointments: ${appointmentList.length}`}
//             color="primary"
//           />

//           <Chip
//             label={`Accepted: ${
//               appointmentList.filter((a:any)=>a.status==="accepted").length
//             }`}
//             color="success"
//           />

//           <Chip
//             label={`Pending: ${
//               appointmentList.filter((a:any)=>a.status==="pending").length
//             }`}
//             color="warning"
//           />

//           <Chip
//             label={`Rejected: ${
//               appointmentList.filter((a:any)=>a.status==="rejected").length
//             }`}
//             color="error"
//           />

//         </Stack>

//       </Card>

//     </Stack>

//   );

// }