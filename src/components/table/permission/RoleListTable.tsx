import React from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

const columns: ColDef[] = [
  {
    headerName: "#",
    field: "ID",
    width: 100,
    valueGetter: (params: any) => {
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: "#",
    field: "role_id",
    hide: true,
  },
  {
    headerName: "Role",
    field: "role_name",
    flex: 1,
    cellRenderer: (params: any) => {
      // Get the role_name and role_id from the row data
      const roleName = params?.data?.role_name;
      const roleId = params?.data?.role_id;
      
      // Encode the role_name to make it URL-safe
      const encodedRoleName = encodeURIComponent(roleName);
      
      return (
        <a href={`/role/view-role/${roleId}?role_name=${encodedRoleName}`} className="text-blue-600">
          {roleName}
        </a>
      );
    },
  },
  {
    headerName: "Role Description",
    field: "description",
    flex: 1,
  },
];

const RoleListTable: React.FC = () => {
  const { rolelistData, roleListLoading } = useAppSelector((state) => state.permission);
  return (
    <div className="h-[calc(100vh-160px)] ag-theme-quartz">
      <AgGridReact
        loading={roleListLoading}
        loadingOverlayComponent={CustomLoadingOverlay}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rolelistData}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default RoleListTable;
