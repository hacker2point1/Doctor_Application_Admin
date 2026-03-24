export const endpoints = {
    admin: {
        login: "/admin/auth/login"
    },
    department: {
        createDeptId: "/admin/doctor/department",
        createDoctor: "/admin/doctor/create",
        departmentList: "/admin/departments/list",
        deleteDepartment: "/admin/department/delete",
        location:"/admin/diagnostic/create",
    },
    doctor: {
        doctorList: "/admin/doctor/list",
        deleteDoctor: "/admin/doctor/delete",
        updateDoctor: "/admin/doctor/update",

    },
    logout: {
        adminLogout: "/admin/logout"
    },
    appoinment: {
        listOfAppoinments: "/admin/doctor/appointment/list",
        confirmById: (id: string) => `/admin/doctor/appointment/${id}`,
        cancelById: (id: string) => `/admin/doctor/appointment/cancelld/${id}`,
        acceptedAppoinments:"/admin/appointment/acceptedlist",
     }

}
export const endpoint = [
    //admin auth
    endpoints.admin.login,

    //doctor
    endpoints.department.createDeptId,
    endpoints.department.createDoctor,
    endpoints.department.departmentList,
    endpoints.doctor.doctorList,
    endpoints.doctor.deleteDoctor,
    endpoints.logout.adminLogout,
    endpoints.department.deleteDepartment,
    endpoints.doctor.updateDoctor,
    endpoints.appoinment.listOfAppoinments,
    endpoints.appoinment.confirmById,
    endpoints.appoinment.cancelById,
    endpoints.appoinment.acceptedAppoinments,
    endpoints.department.location

]


