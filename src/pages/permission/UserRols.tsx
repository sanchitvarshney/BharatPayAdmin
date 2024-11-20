import { HiOutlineLightBulb } from "react-icons/hi";
import ButtonBase from "@mui/material/ButtonBase";
import { ModalContent, ModalTitle, ModalTrigger, Modal } from "@/components/reusable/CustomModel";
import { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import LinearProgress from "@mui/material/LinearProgress";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RoleListTable from "@/components/table/permission/RoleListTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utills/toasterContext";
import { CreateRolePayload } from "@/features/permission/permissionType";
import { createRole, getRoleList } from "@/features/permission/permissionSlice";

const UserRols = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const dispatch = useAppDispatch();
  const { createRoleLoading } = useAppSelector((state) => state.permission);

  useEffect(() => {
    dispatch(getRoleList());
  }, []);
  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="border flex justify-between py-[15px] px-[20px] rounded-sm">
        <div className="flex items-center gap-[3px] text-[15px]">
          <HiOutlineLightBulb className="h-[25px] w-[25px] text-blue-600" />
          <span className="text-stone-800">You can now assign admin roles to security groups as well as users.</span>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-190px)]  rounded-sm shadow shadow-stone-400">
        <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600 ">
          <p className="text-[18px] text-zinc-800">Roles</p>
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger>
              <ButtonBase
                sx={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Create new role
              </ButtonBase>
            </ModalTrigger>
            <ModalContent showCloseButton={false} className="min-w-[50%] min-h-[50%] border-none rounded-sm shadow shadow-stone-400 p-0 overflow-hidden " onInteractOutside={(e) => e.preventDefault()}>
              <div className="h-full ">
                <div className="h-[50px] flex  px-[20px] bg-blue-800 ">
                  <ModalTitle className="text-white font-[500] flex gap-[10px] items-center">
                    <Cross2Icon className="h-[20px] w-[20px] cursor-pointer" onClick={() => setOpen(false)} />
                    Create Role
                  </ModalTitle>
                </div>
                <div className="flex flex-col gap-[20px] p-[20px]">
                  <TextField value={role} onChange={(e) => setRole(e.target.value)} id="standard-basic" label="Name" required variant="standard" />
                  <TextField value={description} onChange={(e) => setdescription(e.target.value)} id="standard-basic" label="Decription" variant="standard" />
                  <div className="flex items-center gap-[20px] justify-end px-[20px]">
                    <Button onClick={() => setOpen(false)} disabled={createRoleLoading}>Cancel</Button>
                    <LoadingButton
                      disabled={createRoleLoading}
                      onClick={() => {
                        if (!role) {
                          showToast("Role name is required", "error");
                        } else {
                          const payload: CreateRolePayload = {
                            role_name: role,
                            description: description,
                          };
                          dispatch(createRole(payload)).then((res: any) => {
                            if (res.payload.data?.success) {
                              setOpen(false);
                              setRole("");
                              setdescription("");
                              showToast(res.payload.data.message || "Role created successfully", "success");
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
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">{createRoleLoading && <LinearProgress />}</div>
              </div>
            </ModalContent>
          </Modal>
        </div>
        <RoleListTable />
      </div>
    </div>
  );
};

export default UserRols;
