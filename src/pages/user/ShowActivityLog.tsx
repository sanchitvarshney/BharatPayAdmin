import { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { ColDef } from "@ag-grid-community/core";
import { userActivityLogs } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { useParams } from "react-router-dom";
import { showToast } from "@/utills/toasterContext";
import { useSelector } from "react-redux";

interface ActivityLog {
  txnNo: string;
  module: string;
  time: string;
  status: string;
  reqBody: any;
  respBody: any;
}

interface ShowActivityLogProps {
  open: boolean;
  handleClose: () => void;
}

const ShowActivityLog: React.FC<ShowActivityLogProps> = ({
  open,
  handleClose,
}) => {
  const [rows, setRows] = useState<ActivityLog[]>([]);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    title: string;
    content: any;
  } | null>(null);
  const dispatch = useAppDispatch();
  const params = useParams();
  const {activityLoading} = useSelector((state: any) => state.user);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "200":
        return "success";
      case "400":
        return "warning";
      case "404":
        return "error";
      case "500":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "200":
        return "Success";
      case "400":
        return "Bad Request";
      case "404":
        return "Not Found";
      case "500":
        return "Server Error";
      default:
        return "Unknown";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleViewData = (title: string, content: any) => {
    setSelectedData({ title, content });
    setViewDialog(true);
  };

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
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        return (
          <Chip
            label={`${status} - ${getStatusMessage(status)}`}
            color={getStatusColor(status)}
            size="small"
          />
        );
      },
    },
    {
      field: "reqBody",
      headerName: "Request Body",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params: any) => {
        return (
          <Tooltip title="View Request Body">
            <IconButton
              size="small"
              onClick={() => handleViewData("Request Body", params.value)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "respBody",
      headerName: "Response Body",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params: any) => {
        const status = params.data.status;
        return (
          <Tooltip title="View Response Body">
            <IconButton
              size="small"
              onClick={() => handleViewData("Response Body", params.value)}
              color={status !== "200" ? "error" : "default"}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
    <>
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
              rowHeight={50}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              loadingOverlayComponent={CustomLoadingOverlay}
              suppressCellFocus={true}
              rowData={rows}
              columnDefs={columns}
              pagination
              paginationPageSize={10}
              loading={activityLoading}
            />
          </div>
        </div>
      </Drawer>

      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">{selectedData?.title}</Typography>
            <IconButton onClick={() => setViewDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="relative">
            <div className="absolute top-2 right-2">
              <Tooltip title="Copy to clipboard">
                <IconButton
                  size="small"
                  onClick={() =>
                    {copyToClipboard(
                      typeof selectedData?.content === "string"
                        ? selectedData.content
                        : JSON.stringify(selectedData?.content, null, 2)
                    )
                    showToast("Copied to clipboard", "info")
                    }
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <pre className="text-xs whitespace-pre-wrap font-mono overflow-x-auto">
                {typeof selectedData?.content === "string"
                  ? selectedData.content
                  : JSON.stringify(selectedData?.content, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShowActivityLog;
