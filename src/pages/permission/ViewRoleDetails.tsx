import React, { useEffect, useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Modal, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, TextField } from "@mui/material";
import { assignRole, getUserRole } from "@/features/permission/permissionSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getActiveUser } from "@/features/menu/menuSlice";
import { showToast } from "@/utills/toasterContext";
import ViewRoleTable from "@/components/table/role/ViewRoleTable";

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

const ViewRoleDetails: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = React.useState([]);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const { asignRoleLoading } = useAppSelector((state) => state.permission);
  const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const id = window.location.pathname.split("/")[3];
  const queryParams = new URLSearchParams(window.location.search); // Get query parameters from the URL
  const role_name = queryParams.get("role_name");

  useEffect(() => {
    dispatch(getUserRole(id));
    dispatch(getActiveUser()).then((res: any) => {
      if (res?.payload?.data?.success) {
        setOptions(res?.payload?.data?.data);
      }
    });
  }, [id]);

  const handleAssignRole = () => {
    const payload = {
      userID: selectedUserId,
      roleID: id,
    };
    if (selectedUserId) {
      dispatch(assignRole(payload)).then((res: any) => {
        if (res?.payload?.data?.success) {
          dispatch(getUserRole(id));
          showToast(res.payload.data.message, "success");
          setOpen(false);
        }
      });
    } else {
      showToast("Please select user", "error");
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="h-[50px] flex items-center gap-[10px] px-[20px] bg-blue-800">
            <Cross2Icon className="cursor-pointer h-[20px] w-[20px] text-white" onClick={() => setOpen(false)} />
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "white" }}>
              Add User
            </Typography>
          </div>
          <div className="p-[50px] relative">
            <Autocomplete
              options={options}
              getOptionLabel={(option: any) => option.text}
              onChange={(_, newValue: User | null) => {
                if (newValue) {
                  setSelectedUserId(newValue.id);
                } else {
                  setSelectedUserId(null);
                }
              }}
              renderInput={(params) => <TextField variant="standard" {...params} label="Select User" />}
            />
            <div className="mt-[20px] flex items-center justify-end">
              <LoadingButton loading={asignRoleLoading} variant="contained" onClick={handleAssignRole}>
                Asign Role
              </LoadingButton>
            </div>
            {/* {roleListLoading && (
              <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
                <LinearProgress />
              </div>
            )} */}
          </div>
        </Box>
      </Modal>
      <div className="p-[20px] grid grid-cols-[300px_1fr] gap-[20px]">
        <div className="rounded-sm shadow shadow-stone-400 h-[50%] p-[20px]">
          <h2 className="text-[20px] font-[500] text-stone-800">{role_name}</h2>
          <p>This is the list of all {role_name}</p>
        </div>
        <div className="flex flex-col h-[calc(100vh-120px)]  rounded-sm shadow shadow-stone-400">
          <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600 ">
            <p className="text-[18px] text-stone-800">Showing all {role_name}</p>
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
          <ViewRoleTable />
        </div>
      </div>
    </>
  );
};

export default ViewRoleDetails;
