import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";

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
  data: TabData[];
  title: string;
}

const TabDetailsDialog: React.FC<TabDetailsDialogProps> = ({ open, onClose, data, title }) => {
  const columnDefs: ColDef[] = [
    { headerName: "Tab ID", field: "tabId" },
    { headerName: "Name", field: "name" },
    { headerName: "URL", field: "url" },
    { headerName: "Order", field: "order" },
    { headerName: "Icon", field: "icon" },
    { headerName: "Description", field: "description" },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (params.value === 1 ? "Active" : "Inactive"),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="tab-details-dialog-title">
      <DialogTitle id="tab-details-dialog-title">{title}</DialogTitle>
      <DialogContent style={{ height: "1400px", width: "5500px" }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={5}
          overlayNoRowsTemplate="<span>No data available</span>"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TabDetailsDialog;
