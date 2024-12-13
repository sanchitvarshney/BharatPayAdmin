import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { ReloadIcon } from "@radix-ui/react-icons";

import {getAllocatedLocationList } from "@/features/location/locationSlice";
import { Icons } from "@/components/icons/icons";
import LocationAllocation from "@/components/table/location/LocationAllocation";
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
  searchQuery: string;
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
const AllocatedLocationTable: React.FC<Props> = ({searchQuery}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [editLocation, setEditLocation] = useState(false);
  const { allotLocationList, loading } = useAppSelector((state) => state.location);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(allotLocationList);

  const dispatch = useAppDispatch();

  // Filter the data based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = allotLocationList.filter((row:any) =>
        row.module_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.module_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allotLocationList);
    }
  }, [searchQuery, allotLocationList]); // Re-filter data when searchQuery or allotLocationList changes

  // Define column definitions
  const columnDefs: ColDef[] = [
    { field: "module_name", headerName: "Module Name", filter: true, flex: 1 },
    { field: "module_description", headerName: "Module Description", flex: 1 },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => {
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
                  setSelectedMenuId(params.data?.loc_all_key || "");
                  setEditLocation(true);
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
  ];

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
        rowData={filteredData}
        columnDefs={columnDefs}
        suppressCellFocus={true}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50]}
      />
      <LocationAllocation
        open={editLocation}
        onClose={() => setEditLocation(false)}
        id={selectedMenuId}
      />
    </div>
  );
};

export default AllocatedLocationTable;
