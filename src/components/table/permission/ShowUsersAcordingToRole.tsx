import React, { useMemo } from "react";
import { Switch } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from '@ag-grid-community/core';
const MenuListTable: React.FC = () => {
  const columns:ColDef[] = [
    {
      field: "projectname",
      headerName: "Project Name",
      width: 200,
    },
    {
      field: "pageName",
      headerName: "Page Name",
      width: 200,
    },
    {
      field: "isParrent",
      headerName: "Is Parent",
      width: 200,
      cellRenderer:(params:any)=> params.value?"Yes" :"No"
    },
    {
      field: "parrentPageName",
      headerName: "Parrent Page Name",
      width: 200,
    },
    {
      field: "pageUrl",
      headerName: "Page Url",
      width: 200,
    },
    {
      field: "icon",
      headerName: "Icon",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: () => <Switch/>,
    },
  ];
  const rows = [
    {
      id: 1,
      projectname: "Project Alpha",
      pageName: "Dashboard",
      isParrent: true,
      parrentPageName: "",
      pageUrl: "/dashboard",
      icon: "dashboard_icon",
      description: "Main dashboard page",
      status: true,
    },
    {
      id: 2,
      projectname: "Project Beta",
      pageName: "Settings",
      isParrent: true,
      parrentPageName: "",
      pageUrl: "/settings",
      icon: "settings_icon",
      description: "Settings page for the project",
      status: false,
    },
    {
      id: 3,
      projectname: "Project Alpha",
      pageName: "User Management",
      isParrent: false,
      parrentPageName: "Settings",
      pageUrl: "/settings/users",
      icon: "user_icon",
      description: "Manage users of the system",
      status: true,
    },
    {
      id: 4,
      projectname: "Project Gamma",
      pageName: "Reports",
      isParrent: true,
      parrentPageName: "",
      pageUrl: "/reports",
      icon: "reports_icon",
      description: "Generate various reports",
      status: true,
    },
    {
      id: 5,
      projectname: "Project Beta",
      pageName: "Profile",
      isParrent: false,
      parrentPageName: "Settings",
      pageUrl: "/settings/profile",
      icon: "profile_icon",
      description: "User profile settings",
      status: false,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div className={"ag-theme-quartz h-[calc(100vh-110px)]"} >
      <AgGridReact defaultColDef={defaultColDef} suppressCellFocus={true} rowData={rows} columnDefs={columns} pagination={true} paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50]} />
    </div>
  );
};

export default MenuListTable;
