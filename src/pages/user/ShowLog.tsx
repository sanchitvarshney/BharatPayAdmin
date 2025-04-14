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
import { userLoginLogs } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { useParams } from "react-router-dom";
import { ColDef } from "@ag-grid-community/core";
import { useSelector } from "react-redux";

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
interface Row {
  CustID: string; // or the appropriate type for CustID
  Email_ID: string; // or the appropriate type for CustID
  // other properties of the row can be added here
}
interface MyComponentProps {
  handleClose: () => void; // handleClose is a function that takes no arguments and returns nothing
  open: any; // handleClose is a function that takes no arguments and returns nothing
}

const ShowLog: React.FC<MyComponentProps> = ({ open, handleClose }) => {
  //   const [rows, setRows] = React.useState([]);
  const [rows, setRows] = useState<Row[]>([]);
  const dispatch = useAppDispatch();
  const params = useParams();
  const {getUserListLoading} = useSelector((state: any) => state.user);
  
  const columns: ColDef[] = [
    {
      field: "Email_ID",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      maxWidth: 400,
    },
    { field: "CustID", headerName: "User ID " },
    { field: "Mobile", headerName: "Mobile No." },
    { field: "Log_Time", headerName: "Log Time " },
    { field: "Status", headerName: "Status" },
    { field: "LogID", headerName: "userID", hide: true },
  ];

  const getDataForTable = async () => {
    dispatch(userLoginLogs(params?.id)).then((res: any) => {
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
      anchor="left" // Can be 'left', 'right', 'top', 'bottom'
      open={open.length}
      onClose={handleClose}
    >
      <div style={{ width: 1050 }}>
        {" "}
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-[20px]">
        <Typography fontWeight={600} variant="h6" fontSize={30} sx={{ my: 2 }}>
          User Login Logs
        </Typography>
        <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600 ">
          <p className="text-[18px] text-stone-800">
            Showing all for {rows[0]?.CustID} {rows[0]?.Email_ID}
          </p>
        </div>
        <div className={"ag-theme-quartz h-[calc(100vh-180px)]  "}>
          <AgGridReact
            rowHeight={60}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            loadingOverlayComponent={CustomLoadingOverlay}
            suppressCellFocus={true}
            loading={getUserListLoading}
            rowData={rows ? rows : []}
            columnDefs={columns}
            pagination
            paginationPageSize={20}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default ShowLog;
