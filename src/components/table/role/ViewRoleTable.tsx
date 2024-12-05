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
    headerName: "User Name",
    field: "user_name",
    
  },

  {
    headerName: "Mobile No.",
    field: "mobile",
    flex: 1,
  },
  {
    headerName: "Email",
    field: "email",
    flex: 1,
  },
];

const ViewRoleTable: React.FC = () => {
  const { userRoleList, roleListLoading } = useAppSelector((state) => state.permission);
  return (
    <div className="h-[calc(100vh-160px)] ag-theme-quartz">
      <AgGridReact
        loading={roleListLoading}
        loadingOverlayComponent={CustomLoadingOverlay}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={userRoleList||[]}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default ViewRoleTable;
