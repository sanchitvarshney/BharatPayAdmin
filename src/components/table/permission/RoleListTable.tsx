import React, { useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons/icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import SharedDialog from "@/components/shared/SharedDialog";
import { deleteRole, editRole, getRoleList } from "@/features/permission/permissionSlice";
import { showToast } from "@/utills/toasterContext";
import LoadingButton from "@mui/lab/LoadingButton";

const RoleListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rolelistData, roleListLoading, deleteRoleLoading, updateRoleLoading } = useAppSelector((state) => state.permission);
  const [open, setOpen] = React.useState(false);
  const [roleid, setRoleid] = React.useState<string>("");
  const [role, setRole] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);
  const columns: ColDef[] = [
    {
      headerName: "#",
      field: "ID",
      width: 100,
      valueGetter: (params: any) => {
        return params.node.rowIndex + 1;
      },
    },
    {
      headerName: "#",
      field: "role_id",
      hide: true,
    },
    {
      headerName: "Role",
      field: "role_name",
      flex: 1,
      cellRenderer: (params: any) => {
        // Get the role_name and role_id from the row data
        const roleName = params?.data?.role_name;
        const roleId = params?.data?.role_id;

        // Encode the role_name to make it URL-safe
        const encodedRoleName = encodeURIComponent(roleName);

        return (
          <Link to={`/role/view-role/${roleId}?role_name=${encodedRoleName}`} className="text-blue-600 flex items-center gap-[10px]">
            {roleName}
            <Icons.followLink fontSize="small" sx={{ fontSize: "15px" }} />
          </Link>
        );
      },
    },
    {
      headerName: "Role Description",
      field: "description",
      flex: 1,
    },
    {
      headerName: "Users",
      field: "count",
      flex: 1,
    },
    {
      headerName: "",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full gap-[10px]">
          <IconButton
            onClick={() => {
              setUpdate(true);
              setRole(params?.data?.role_name);
              setdescription(params?.data?.description);
              setRoleid(params?.data?.role_id);
            }}
            color="primary"
          >
            <Icons.edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => {
              setOpen(true);
              setRoleid(params?.data?.role_id);
            }}
            disabled={params?.data?.count > 0}
            color="error"
          >
            <Icons.delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];
  return (
    <>
      <Dialog maxWidth="md" open={update} onClose={() => setUpdate(false)}>
        <div className="absolute top-0 left-0 right-0 bg-white h-[20-px]">{updateRoleLoading && <LinearProgress />}</div>
        <div className="flex items-center justify-between pr-[20px] h-[50px]">
          <DialogTitle>
            <Typography fontWeight={600}>Update Role</Typography>
          </DialogTitle>
          <IconButton onClick={() => setUpdate(false)}>
            <Icons.close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent>
          <div className="h-full min-w-[500px] ">
            <div className="flex flex-col gap-[20px] ">
              <TextField value={role} onChange={(e) => setRole(e.target.value)} id="standard-basic" label="Name" required variant="filled" />
              <TextField multiline rows={3} value={description} onChange={(e) => setdescription(e.target.value)} id="standard-basic" label="Description" variant="filled" />
            </div>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <div className="flex items-center gap-[10px] justify-end px-[20px]">
            <Button size="small" startIcon={<Icons.close />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setUpdate(false)} disabled={updateRoleLoading}>
              Cancel
            </Button>
            <LoadingButton
            size="small"
              startIcon={<Icons.add />}
              disabled={updateRoleLoading}
              onClick={() => {
                if (!role) {
                  showToast("Role name is required", "error");
                } else {
                  const payload = {
                    id: roleid,
                    description: description,
                    name: role,
                  };
                  dispatch(editRole(payload)).then((res: any) => {
                    if (res.payload.data?.success) {
                      setUpdate(false);
                      setRole("");
                      setdescription("");
                      dispatch(getRoleList());
                      setRoleid("");
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
      <SharedDialog
        loading={deleteRoleLoading}
        open={open}
        title="Delete Role"
        content="Are you sure you want to delete this role?"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          dispatch(deleteRole(roleid)).then((res: any) => {
            if (res?.payload?.data?.success) {
              setOpen(false);
              dispatch(getRoleList());
              showToast(res.payload.data.message, "success");
            }
          });
        }}
        startIcon={<Icons.delete />}
        confirmText="Continue"
        cancelText="Cancel"
      />
      <div className="h-[calc(100vh-160px)] ag-theme-quartz">
        <AgGridReact
          loading={roleListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rolelistData || []}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </>
  );
};

export default RoleListTable;
