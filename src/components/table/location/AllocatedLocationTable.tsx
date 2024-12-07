import React, { useRef, useState, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { ReloadIcon } from "@radix-ui/react-icons";

import { getAllocatedLocationList } from "@/features/location/locationSlice";
import { Icons } from "@/components/icons/icons";
// TypeScript types for hierarchical menu data and row data
interface MenuData {
  menu_key: string;
  name: string;
  url: string | null;
  is_active: number;
  description: string;
  children?: MenuData[];
  parent_menu_key: string | null;
  order: number;
  icon: string | null;
  project_name: string;
  hasTab: boolean;
}
type Props = {
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
};

interface RowData {
  orgHierarchy: string[];
  order: any;
  url: string | null;
  status: React.ReactNode;
  action?: React.ReactNode;
  menu_key?: string;
  name: string;
  description: string;
  icon: string | null;
  project_name: string;
  hasTab: boolean;
}

// Utility function to flatten hierarchical data
const flattenMenuHierarchy = (data: MenuData[], parentHierarchy: string[] = []): RowData[] => {
  let result: RowData[] = [];

  data.forEach((item) => {
    const currentHierarchy = [...parentHierarchy, item.name];
    result.push({
      orgHierarchy: currentHierarchy,
      order: item.order,
      url: item.url,
      status: item.is_active === 1 ? "ACTIVE" : "INACTIVE",
      menu_key: item.menu_key,
      name: item.name,
      description: item.description,
      icon: item.icon,
      project_name: item.project_name,
      hasTab: item.hasTab,
    });

    if (item.children && item.children.length > 0) {
      result = result.concat(flattenMenuHierarchy(item.children, currentHierarchy));
    }
  });

  return result;
};

// Example component for Tree Data Table with Menu Data
const AllocatedLocationTable: React.FC<Props> = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { allotLocationList, loading } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const [columnDefs] = useState<ColDef[]>([
    { field: "module_name", headerName: "Module Name", filter: true, flex: 1 },
    { field: "module_description", headerName: "Module Description", flex: 1 },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => {
        console.log(params.data);
        const [menuid, setMenuid] = useState("");
        const { deleteMenuLoading } = useAppSelector((state) => state.menu);
        return menuid === params.data?.menu_key && deleteMenuLoading ? (
          <IconButton aria-label="delete" size="small">
            <ReloadIcon className="animate-spin" fontSize="small" />
          </IconButton>
        ) : (
          <>
            <div className="flex items-center gap-[10px]">
              <IconButton
                color="primary"
                onClick={() => {
                  setMenuid(params.data?.menu_key || "");
                }}
                aria-label="edit"
                size="small"
              >
                <Icons.edit fontSize="small" />
              </IconButton>
              <IconButton
                disabled
                color="error"
                onClick={() => {
                  setMenuid(params.data?.menu_key || "");
                }}
                aria-label="edit"
                size="small"
              >
                <Icons.delete fontSize="small" />
              </IconButton>
            </div>
          </>
        );
      },

      sortable: false,
      filter: false,
      maxWidth: 200,
    },
  ]);

  useEffect(() => {
    dispatch(getAllocatedLocationList());
  }, []);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-140px)] ">
      <AgGridReact
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        loading={loading}
        loadingOverlayComponent={CustomLoadingOverlay}
        ref={gridRef}
        rowData={allotLocationList}
        columnDefs={columnDefs}
        suppressCellFocus={true}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default AllocatedLocationTable;
