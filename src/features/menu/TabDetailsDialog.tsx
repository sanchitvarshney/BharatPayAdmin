import React, { useEffect, useRef } from "react";
import {  Dialog, DialogTitle, Divider, IconButton, DialogContent } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Icons } from "@/components/icons/icons";

// Define the data structure for the tab
interface TabData {
  tabId: string;
  name: string;
  url: string;
  order: string;
  icon: string;
  description: string;
  status: number;
}

interface TabDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  data: any;
  title: string;
  loading: boolean;
}

const TabDetailsDialog: React.FC<TabDetailsDialogProps> = ({ open, onClose, data, loading }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = React.useState<TabData[]>([]);

  const columnDefs: ColDef[] = [
    { headerName: "Name", field: "name", filter: true },
    { headerName: "URL", field: "url", filter: true },
    { headerName: "Order", field: "order", filter: true },
    { headerName: "Icon", field: "icon", filter: true },
    { headerName: "Description", field: "description", filter: true },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (params.value === 1 ? "Active" : "Inactive"),
    },
  ];

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <div className="h-[50px] flex items-center justify-between pr-[20px]">
        <DialogTitle fontWeight={600}>Tab Details</DialogTitle>
        <IconButton onClick={onClose}>
          <Icons.close />
        </IconButton>
      </div>
      <Divider />
      <DialogContent sx={{ minWidth: "70vw",p:0 }}>
        <div className="overflow-hidden ag-theme-quartz " style={{ height: "calc(100vh - 250px)", borderRadius: "8px" }}>
          <AgGridReact
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            loading={loading}
            loadingOverlayComponent={CustomLoadingOverlay}
            ref={gridRef}
            rowData={rowData || []} // Ensure data fallback
            columnDefs={columnDefs}
            treeData={false} // Use false for flat data
            groupDefaultExpanded={-1}
            suppressCellFocus={true}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            // domLayout="autoHeight" // This makes the grid dynamically adjust its height based on the number of rows
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TabDetailsDialog;
