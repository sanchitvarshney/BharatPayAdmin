import React, { useEffect, useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { assignRole, getUserRole } from "@/features/permission/permissionSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utills/toasterContext";
import ViewRoleTable from "@/components/table/role/ViewRoleTable";
import { Icons } from "@/components/icons/icons";
import SelectUser, {
  UserType,
} from "@/components/reusable/selectors/SelectUser";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ViewRoleDetails: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const navigate = useNavigate();
  const { asignRoleLoading } = useAppSelector((state) => state.permission);
  const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const [selectedUserId, setSelectedUserId] = useState<UserType | null>(null);
  const id = window.location.pathname.split("/")[3];
  const queryParams = new URLSearchParams(window.location.search); // Get query parameters from the URL
  const role_name = queryParams.get("role_name");

  useEffect(() => {
    dispatch(getUserRole(id));
  }, [id]);

  const handleAssignRole = () => {
    if (selectedUserId) {
      const payload = {
        userID: selectedUserId.id,
        roleID: id,
      };
      dispatch(assignRole(payload)).then((res: any) => {
        if (res?.payload?.data?.success) {
          dispatch(getUserRole(id));
          showToast(res.payload.data.message, "success");
          setOpen(false);
          setSelectedUserId(null);
        }
      });
    } else {
      showToast("Please select user", "error");
    }
  };

  return (
    <>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex items-center justify-between h-[50px] pr-[20px]">
          <DialogTitle fontWeight={600}>Add User</DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <Icons.close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent sx={{ minWidth: "40vw" }}>
          <div className="relative py-[50px]">
            <SelectUser value={selectedUserId} onChange={setSelectedUserId} />
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <LoadingButton
            startIcon={<Icons.user fontSize="small" />}
            loadingPosition="start"
            loading={asignRoleLoading}
            variant="contained"
            onClick={handleAssignRole}
          >
            Asign Role
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <div className="p-[20px]">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => navigate(-1)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              minWidth: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #d6d3d1",
              "&:hover": {
                backgroundColor: "#f5f5f4",
              },
            }}
          >
            <IoMdArrowRoundBack className="h-[20px] w-[20px] text-stone-400" />
          </Button>
          <h2 className="text-[20px] font-[500] text-stone-800">{role_name}</h2>
        </div>
        <div className="grid grid-cols-[300px_1fr] gap-[20px]">
          <div className="rounded-sm shadow shadow-stone-400 h-[calc(100vh-180px)] p-[20px]">
            <p>This is the list of all {role_name}</p>
          </div>
          <div className="flex flex-col h-[calc(100vh-180px)] rounded-sm shadow shadow-stone-400">
            <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600">
              <p className="text-[18px] text-stone-800">
                Showing all {role_name}
              </p>
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
      </div>
    </>
  );
};

export default ViewRoleDetails;
