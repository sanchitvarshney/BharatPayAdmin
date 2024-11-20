import MenuListTable from "@/components/table/menu/MenuListTable";
import PermissionTable from "@/components/table/permissions/PermissionTable";
import {
  getActiveUser,
  getMenuList,
  getRoleMenu,
  getUserMenu,
  saveRoleMenuPermission,
  saveUserMenuPermission,
} from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { getRoleList } from "@/features/permission/permissionSlice";
import { setIsId } from "@/features/menu/isIdReducer";
import { useSelector } from "react-redux";
import { showToast } from "@/utills/toasterContext";
import { log } from "console";
const schema = z.object({
  type: z.string().nonempty("Project name is required"),
  role: z.string().nonempty("Page name is required"),
});
// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

const PermissionList: React.FC = () => {
  const [options, setOptions] = React.useState([]);
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [selectedVal, setSelectedVal] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const isId = useSelector((state: RootState) => state.isId.isId);
  const {
    // handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      role: "",
    },
  });
  console.log("selectedType", selectedType);

  const dispatch = useAppDispatch();
  // const watchRole = watch("role");
  // var watchType = watch("type");
  // var localSelectedType = localStorage.getItem("selectedType");
  // var localSelectedVal = localStorage.getItem("selectedVal");
  useEffect(() => {
    dispatch(getMenuList());
    dispatch(getRoleList()).then((res: any) => {
      if (res?.payload?.data?.success) {
        let arr = res?.payload?.data?.roles?.map((r) => {
          return {
            id: r.role_id,
            text: r.role_name,
          };
        });
        // console.log("arr", arr);

        setRoleOptions(arr);
      }
    });
    dispatch(getActiveUser()).then((res: any) => {
      if (res?.payload?.data?.success) {
        setOptions(res?.payload?.data?.data);
      }
    });
  }, []);
  const updateRow = (
    value: any,

    isView: boolean,
    isedit: boolean,
    isDelete: boolean
  ) => {
    console.log("selectedType", selectedType);
    let newtype = localStorage.getItem("selectedType");
    if (newtype == "User") {
      let payload = {
        user_id: localStorage.getItem("selectedVal"),
        menu_key: value.data.menu_key,
        canView: isView,
        canEdit: isedit,
        canDelete: isDelete,
      };
      // console.log("payload", payload);

      // return;
      dispatch(saveUserMenuPermission(payload)).then((res: any) => {
        if (res?.payload?.data?.success) {
          getlist();
          showToast(res.payload.data.message, "success");
        } else {
          getlist();
          showToast(res.payload.data.message, "error");
        }
      });
    } else {
      let payload = {
        role_id: localStorage.getItem("selectedVal"),
        menu_key: value.data.menu_key,
        canView: isView,
        canEdit: isedit,
        canDelete: isDelete,
      };
      // console.log("payload", payload);
      // return;
      dispatch(saveRoleMenuPermission(payload)).then((res: any) => {
        if (res?.payload?.data?.success) {
          getlist();
          showToast(res.payload.data.message, "success");
        } else {
          getlist();
          showToast(res.payload.data.message, "error");
        }
      });
    }
  };
  // useEffect(() => {
  //   if (watchRole) {
  //     console.log("watchRole", watchRole);
  //     console.log("watchType", watchType);
  //   }
  // }, [localSelectedVal, localSelectedType]);

  const getlist = () => {
    if (localStorage.getItem("selectedType") == "User") {
      dispatch(getUserMenu(localStorage.getItem("selectedVal"))).then(
        (res: any) => {
          // console.log("response", res);
        }
      );
    } else {
      dispatch(getRoleMenu(localStorage.getItem("selectedVal"))).then(
        (res: any) => {
          // console.log("response", res);
        }
      );
    }
    // dispatch(getUserMenu(selectedVal)).then((res: any) => {
    //   console.log("response", res);
    // });
  };
  useEffect(() => {
    if (selectedVal.length) {
      dispatch(setIsId(selectedVal));
      localStorage.setItem("selectedVal", selectedVal);
      localStorage.setItem("selectedType", selectedType);
      getlist();
    } else {
    }
  }, [selectedVal, selectedType]);
  let type = [
    { id: "User", text: "User" },
    { id: "Role", text: "Role" },
  ];

  return (
    <div className="p-[20px] ">
      <form
      //  onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-[20px] flex max-w-[70%] gap-[30px]">
          {/* Project Name */}
          <div className="gap-4">
            <FormControl
              variant="standard"
              sx={{ minWidth: 200 }}
              error={!!errors.project}
            >
              <InputLabel>Type</InputLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-[150px]"
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                    }}
                    placeholder="Search"
                  >
                    {type.map((option) => (
                      <MenuItem
                        key={option?.id}
                        value={option?.id}
                        // defaultValue={option[0]}
                      >
                        {option?.text}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.project && (
                <p className="text-red-600 text-[13px]">
                  {errors.project.message}
                </p>
              )}
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ minWidth: 200 }}
              error={!!errors.project}
            >
              <InputLabel>Role</InputLabel>{" "}
              {selectedType === "User" ? (
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="w-[150px]"
                      placeholder="Search"
                      onChange={(e) => {
                        setSelectedVal(e.target.value);
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem
                          key={option?.id}
                          value={option?.id}
                          // defaultValue={option[0]}
                        >
                          {option?.text}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              ) : (
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="w-[150px]"
                      onChange={(e) => {
                        setSelectedVal(e.target.value);
                      }}
                    >
                      {roleOptions.map((option) => (
                        <MenuItem
                          key={option?.id}
                          value={option?.id}
                          //   defaultValue={option[0]}
                        >
                          {option?.text}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.project && (
                <p className="text-red-600 text-[13px]">
                  {errors.project.message}
                </p>
              )}
            </FormControl>
          </div>
        </div>
      </form>
      <div className=" mt-[20px] rounded-sm shadow shadow-stone-400 ">
        {/* {selectedType && ( */}
        <PermissionTable
          selectedVal={selectedVal}
          selectedType={selectedType}
          updateRow={updateRow}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default PermissionList;
