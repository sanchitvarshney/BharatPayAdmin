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
  loading: boolean
}

const TabDetailsDialog: React.FC<TabDetailsDialogProps> = ({
  open,
  onClose,
  data,
  loading,
}) => {
  const gridRef = useRef<AgGridReact>(null);
const [rowData , setRowData] = React.useState<TabData[]>([])
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

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    fontSize: "11px",
    boxShadow: 24,
    width: "80%",
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {data ? "Update Menu" : "Add New Menu"}
        </Typography>
        <div className="ag-theme-quartz h-[calc(100vh-110px)]">
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
          />
        </div>
        <div className="mt-[20px] justify-end flex gap-[10px]">
             
              <Button onClick={() => onClose()} variant="contained">Close</Button>
            </div>
      </Box>
    </Modal>
  );
};

export default TabDetailsDialog;
