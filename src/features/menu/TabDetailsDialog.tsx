import React, { useEffect, useRef } from "react";
import { Modal, Typography, Box, Button } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

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

const TabDetailsDialog: React.FC<TabDetailsDialogProps> = ({
  open,
  onClose,
  data,
  loading,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = React.useState<TabData[]>([]);

  const columnDefs: ColDef[] = [
    { headerName: "Name", field: "name",filter: true },
    { headerName: "URL", field: "url",filter: true },
    { headerName: "Order", field: "order",filter: true },
    { headerName: "Icon", field: "icon",filter: true },
    { headerName: "Description", field: "description",filter: true },
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

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    fontSize: "12px",
    boxShadow: 24,
    width: "80%",
    maxWidth: "1200px", // Limit max width for better responsiveness
    p: 4,
    borderRadius: "8px", // Rounded corners
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Tab Details
        </Typography>
        <div className="ag-theme-quartz" style={{ height: "calc(100vh - 250px)", border: "1px solid #ccc", borderRadius: "8px" }}>
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
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary" sx={{ paddingX: 3 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TabDetailsDialog;
