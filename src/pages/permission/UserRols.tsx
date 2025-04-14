import { HiOutlineLightBulb } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RoleListTable from "@/components/table/permission/RoleListTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utills/toasterContext";
import { CreateRolePayload } from "@/features/permission/permissionType";
import { createRole, getRoleList } from "@/features/permission/permissionSlice";
import { Icons } from "@/components/icons/icons";

const UserRols = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const dispatch = useAppDispatch();
  const { createRoleLoading } = useAppSelector((state) => state.permission);
  const { menuList } = useAppSelector((state: any) => state.menu);

  // Safe check to ensure menuList is an array before iterating
  const findMenuKey = (url: string) => {
    if (Array.isArray(menuList)) {
      for (let menu of menuList) {
        if (Array.isArray(menu.children)) {
          for (let child of menu.children) {
            if (child.url === url) {
              return child.menu_key;
            }
          }
        }
      }
    }
    return null; // Return null if no match is found or menuList is not an array
  };

  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(
    () => findMenuKey(window.location.pathname),
    [menuList]
  );

  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  useEffect(() => {
    dispatch(getRoleList());
  }, [menuList]);

  return (
    <>
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <div className="absolute top-0 left-0 right-0 bg-white h-[20-px]">
          {createRoleLoading && <LinearProgress />}
        </div>
        <div className="flex items-center justify-between pr-[20px] h-[50px]">
          <DialogTitle>
            <Typography fontWeight={600}>Create Role</Typography>
          </DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <Icons.close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent>
          <div className="h-full min-w-[500px] ">
            <div className="flex flex-col gap-[20px] ">
              <TextField
                value={role}
                onChange={(e) => setRole(e.target.value)}
                id="standard-basic"
                label="Name"
                required
                variant="filled"
              />
              <TextField
                multiline
                rows={3}
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                id="standard-basic"
                label="Description"
                variant="filled"
              />
            </div>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <div className="flex items-center gap-[20px] justify-end px-[20px]">
            <Button
              startIcon={<Icons.close />}
              variant="contained"
              sx={{ background: "white", color: "red" }}
              onClick={() => setOpen(false)}
              disabled={createRoleLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              startIcon={<Icons.add />}
              disabled={createRoleLoading}
              onClick={() => {
                if (!role) {
                  showToast("Role name is required", "error");
                } else {
                  const payload: CreateRolePayload = {
                    role_name: role,
                    description: description,
                    securityType :"general",
                  };
                  dispatch(createRole(payload)).then((res: any) => {
                    if (res.payload.data?.success) {
                      setOpen(false);
                      setRole("");
                      setdescription("");
                      showToast(
                        res.payload.data.message || "Role created successfully",
                        "success"
                      );
                      dispatch(getRoleList());
                    }
                  });
                }
              }}
              loadingPosition="start"
              variant="contained"
            >
              Create
            </LoadingButton>
          </div>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col ">
        <div className="h-[80px] px-[20px] flex items-center">
          <div className="border flex justify-between py-[10px] px-[20px] rounded-sm w-full ">
            <div className="flex items-center gap-[3px] text-[15px]">
              <HiOutlineLightBulb className="h-[25px] w-[25px] text-blue-600" />
              <span className="text-stone-800">
                You can now assign admin roles to security groups as well as
                users.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-[calc(100vh-155px)] ">
          <div className="h-[50px] bg-zinc-100 flex items-center justify-between gap-[20px] px-[20px]  ">
            <div className="flex items-center gap-[10px]">
              <Typography fontWeight={500}>Roles</Typography>
              <Button
                onClick={() => setOpen(true)}
                startIcon={<Icons.add />}
                sx={{ textTransform: "none" }}
              >
                Create Role
              </Button>
            </div>
            <div>
              <IconButton onClick={() => dispatch(getRoleList())}>
                <Icons.refresh />
              </IconButton>
            </div>
          </div>
          <RoleListTable />
        </div>
      </div>
    </>
  );
};

export default UserRols;
