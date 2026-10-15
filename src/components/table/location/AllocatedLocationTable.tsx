import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { ReloadIcon } from "@radix-ui/react-icons";

import { getAllocatedLocationList } from "@/features/location/locationSlice";
import { Icons } from "@/components/icons/icons";
import LocationAllocation from "@/components/table/location/LocationAllocation";
import { leftAlignedColumn } from "@/utills/agGridAlignUtils";

type Props = {
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
};



const ActionCellRenderer = (params: any) => {
  const [menuid, setMenuid] = useState("");
  const { deleteMenuLoading } = useAppSelector((state) => state.menu);
  return menuid === params.data?.menu_key && deleteMenuLoading ? (
    <IconButton aria-label="delete" size="small">
      <ReloadIcon className="animate-spin" fontSize="small" />
    </IconButton>
  ) : (
    <div className="flex items-center gap-[10px]">
      <IconButton
        color="primary"
        onClick={() => params.onEdit(params.data?.loc_all_key || "")}
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
        aria-label="delete"
        size="small"
      >
        <Icons.delete fontSize="small" />
      </IconButton>
    </div>
  );
};

const AllocatedLocationTable: React.FC<Props> = ({ searchQuery }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [editLocation, setEditLocation] = useState(false);
  const { allotLocationList, loading } = useAppSelector(
    (state) => state.location,
  );
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(allotLocationList);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchQuery) {
      const filtered = allotLocationList.filter(
        (row: any) =>
          row.module_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.module_description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allotLocationList);
    }
  }, [searchQuery, allotLocationList]);

  const columnDefs: ColDef[] = [
    {
      field: "#",
      headerName: "#",
      filter: false,
      width: 50,
      cellRenderer: (params: any) => (params.node?.rowIndex ?? 0) + 1,
    },
    {
      field: "module_name",
      headerName: "Module Name",
      filter: true,
      flex: 0.5,
      ...leftAlignedColumn,
      wrapText: true,
      autoHeight: true,
    },
    { field: "module_description", headerName: "Module Description", flex: 1 },
    {
      headerName: "Action",
      field: "action",
      ...leftAlignedColumn,
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        onEdit: (id: string) => {
          setSelectedMenuId(id);
          setEditLocation(true);
        },
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
