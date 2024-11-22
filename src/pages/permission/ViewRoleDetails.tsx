import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import ButtonBase from "@mui/material/ButtonBase";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, LinearProgress, Modal, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { getUserRole } from "@/features/permission/permissionSlice";
import { useAppSelector } from "@/hooks/useReduxHook";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  overflow: "hidden",
};
interface User {
  user: string;
  id: string;
}

const users: User[] = [
  { user: "Sachin", id: "1" },
  { user: "Virat", id: "2" },
  { user: "Rohit", id: "3" },
  // Add more users here
];

const ViewRoleDetails: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const paginationModel = { page: 0, pageSize: 5 };
  const handleOpen = () => setOpen(true);
  const {userRoleList} = useAppSelector((state) => state.permission);
  const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const id = window.location.pathname.split("/")[3];
  console.log(id,selectedUserId);
useEffect(() => {
  dispatch(getUserRole(id) as any);
},[id])
  const columns: GridColDef[] = [
    {
      field: "user_name",
      headerName: "User Name",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      // renderCell: (params: any) => <span style={{ textTransform: "capitalize" }}>{params.value}</span>,
    },
  ];
console.log(userRoleList)
  // Dummy Data
  // const rows = [
  //   {
  //     id: 1,
  //     admin: "John Doe",
  //     adminImage: "https://randomuser.me/api/portraits/men/1.jpg",
  //     organizationalUnit: "Sales",
  //     type: "admin",
  //   },
  //   {
  //     id: 2,
  //     admin: "Jane Smith",
  //     adminImage: "https://randomuser.me/api/portraits/women/2.jpg",
  //     organizationalUnit: "Marketing",
  //     type: "user",
  //   },
  //   {
  //     id: 3,
  //     admin: "Mike Johnson",
  //     adminImage: "https://randomuser.me/api/portraits/men/3.jpg",
  //     organizationalUnit: "IT",
  //     type: "admin",
  //   },
  // ];
  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="h-[50px] flex items-center gap-[10px] px-[20px] bg-blue-800">
            <Cross2Icon className="cursor-pointer h-[20px] w-[20px] text-white" onClick={() => setOpen(false)} />
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "white" }}>
              Add User - Super Admin
            </Typography>
          </div>
          <div className="p-[50px] relative">
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.user}
              onChange={(_, newValue: User | null) => {
                if (newValue) {
                  setSelectedUserId(newValue.id);
                } else {
                  setSelectedUserId(null);
                }
              }}
              renderInput={(params) => <TextField variant="standard" {...params} label="Select User" />}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <div className="flex items-center ">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Admin" style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 8 }} />
                    <div>
                      <p className="text-[13px] text-zinc-500">{option.user}</p>
                      <p className="text-[13px] text-zinc-500">sachin@gmail.com</p>
                    </div>
                  </div>
                </li>
              )}
            />
            {/* <div className="border border-zinc-200 mt-[30px]">
              <div className="h-[50px] grid grid-cols-[1fr_1fr_1fr_1fr_100px] items-center px-[10px] bg-slate-50 border-b">
                <p>Selected users</p>
                <p>Organizational unit</p>
                <p>Condition</p>
                <p>Role assignment status</p>
                <p></p>
              </div>
              <div className="flex flex-col max-h-[200px] overflow-y-auto">
                <div className=" grid grid-cols-[1fr_1fr_1fr_1fr_100px] items-center px-[10px] py-[10px] ">
                  <div className="flex items-center ">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Admin" style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 8 }} />
                    <div>
                      <p>Sachin</p>
                      <p>sachin@gmail.com</p>
                    </div>
                  </div>
                  <p>All organizational units</p>
                  <p>--</p>
                  <p>--</p>
                  <Cross2Icon className="cursor-pointer h-[20px] w-[20px]" />
                </div>
              </div>
            </div> */}
            <div className="mt-[20px] flex items-center justify-end">
              <LoadingButton variant="contained">Asign Role</LoadingButton>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
              <LinearProgress />
            </div>
          </div>
        </Box>
      </Modal>
      <div className="p-[20px] grid grid-cols-[300px_1fr] gap-[20px]">
        <div className="rounded-sm shadow shadow-stone-400 h-[50%] p-[20px]">
          <h2 className="text-[20px] font-[500] text-stone-800">Super Admin</h2>
          <p>This is the list of all super admins</p>
        </div>
        <div className="flex flex-col h-[calc(100vh-120px)]  rounded-sm shadow shadow-stone-400">
          <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600 ">
            <p className="text-[18px] text-stone-800">Showing all Super Admins</p>
            <ButtonBase
              onClick={handleOpen}
              sx={{
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              Assign users
            </ButtonBase>
          </div>
          <DataGrid
            className="w-full max-h-[calc(100vh-160px)]"
            sx={{
              [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                outline: "none",
              },
              [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
                outline: "none",
              },
              [`& .${gridClasses.panel}`]: {
                border: "none",
              },
            }}
            checkboxSelection
            rows={userRoleList}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
    </>
  );
};

export default ViewRoleDetails;
