import { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { userActivityLogs } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { useParams } from "react-router-dom";
import { ColDef } from "@ag-grid-community/core";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

interface ActivityLog {
  txnNo: string;
  module: string;
  time: string;
  reqBody: any;
  respBody: any;
}

interface ShowActivityLogProps {
  open: boolean;
  handleClose: () => void;
  // data: ActivityLog[];
}

const ShowActivityLog: React.FC<ShowActivityLogProps> = ({
  open,
  handleClose,
}) => {
  const [rows, setRows] = useState<ActivityLog[]>([]);
  const dispatch = useAppDispatch();
  const params = useParams();

  const columns: ColDef[] = [
    {
      field: "txnNo",
      headerName: "Transaction No",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "module",
      headerName: "Module",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "reqBody",
      headerName: "Request Body",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const reqBody = params.value;
        return (
          <div className="max-h-[100px] overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(reqBody, null, 2)}
            </pre>
          </div>
        );
      },
    },
    {
      field: "respBody",
      headerName: "Response Body",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const respBody = params.value;
        return (
          <div className="max-h-[100px] overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">
              {typeof respBody === "string"
                ? respBody
                : JSON.stringify(respBody, null, 2)}
            </pre>
          </div>
        );
      },
    },
  ];

  const getDataForTable = async () => {
    dispatch(userActivityLogs(params?.id)).then((res: any) => {
      if (res?.payload?.data?.success) {
        setRows(res?.payload?.data?.data);
      }
    });
  };

  useEffect(() => {
    if (open) {
      getDataForTable();
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: "80%" },
      }}
    >
      <div className="p-[20px]">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight={600}>
            Activity Logs
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-100px)]">
          <AgGridReact
            rowHeight={100}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            loadingOverlayComponent={CustomLoadingOverlay}
            suppressCellFocus={true}
            rowData={rows}
            columnDefs={columns}
            pagination
            paginationPageSize={10}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default ShowActivityLog;
