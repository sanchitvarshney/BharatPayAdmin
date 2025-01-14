import PermissionTable from "@/components/table/permissions/PermissionTable";
import { getRoleMenu, getUserMenu, saveRoleMenuPermission, saveUserMenuPermission } from "@/features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { getRoleList } from "@/features/permission/permissionSlice";
import { setIsId } from "@/features/menu/isIdReducer";
import { showToast } from "@/utills/toasterContext";
import SelectUser, { UserType } from "@/components/reusable/selectors/SelectUser";
import { findMenuKey } from "@/general";
const schema = z.object({
  type: z.string().nonempty("Project name is required"),
  role: z.string().nonempty("Page name is required"),
  project: z.string().nonempty("Project name is required"),
});
// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

const PermissionList: React.FC = () => {
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [selectedVal, setSelectedVal] = React.useState<any>("");
  const [selectedType, setSelectedType] = React.useState<any>("");
  const [user, setUser] = React.useState<UserType | null>(null);
  // const isId = useSelector((state: RootState) => state.isId.isId);
  const { menuList } = useAppSelector((state: any) => state.menu); 
  const {
    // handleSubmit,
    control,
    // reset,
    // watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      role: "",
    },
  });

  const dispatch = useAppDispatch();
  const menuKey = useMemo(() => findMenuKey(window.location.pathname, menuList), [menuList]);
  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);
  
  useEffect(() => {
    // dispatch(getMenuList());
    dispatch(getRoleList()).then((res: any) => {
      if (res?.payload?.data?.success) {
        let arr = res?.payload?.data?.roles?.map((r: any) => {
          return {
            id: r.role_id,
            text: r.role_name,
          };
        });
        setRoleOptions(arr);
      }
    });
  }, [menuKey]);
  const updateRow = (value: any, isView: boolean, isedit: boolean, isAdd: boolean, isDelete: boolean) => {
    let newtype = localStorage.getItem("selectedType");
    if (newtype == "User") {
      let payload = {
        user_id: localStorage.getItem("selectedVal"),
        menu_key: value.data.menu_key,
        canView: isView,
        canEdit: isedit,
        canAdd: isAdd,
        canDelete: isDelete,
      };
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
        canAdd: isAdd,
        canDelete: isDelete,
      };
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

  const getlist = () => {
    const selectedVal = localStorage.getItem("selectedVal");
    if (selectedVal !== null) {
      const id = selectedVal;
      if (localStorage.getItem("selectedType") == "User") {
        dispatch(getUserMenu(id)).then((res: any) => {
          console.log("response", res);
        });
      } else {
        dispatch(getRoleMenu(id)).then((res: any) => {
          console.log("response", res);
        });
      }
    } else {
      // Handle the case where selectedVal is null
    }
  };
  useEffect(() => {
    if (selectedVal.length) {
      dispatch(setIsId(selectedVal));
      localStorage.setItem("selectedVal", selectedVal);
      localStorage.setItem("selectedType", selectedType);
      getlist();
    } else {
    }
  }, [selectedVal, selectedType , user]);
  let type = [
    { id: "User", text: "User" },
    { id: "Role", text: "Role" },
  ];

  const handleTypeChange = (newValue: any) => {
    setSelectedType(newValue?.id || "");
    setSelectedVal(""); // Clear selected value when changing the type
    setUser(null);
  };

  const handleRoleChange = (newValue: any) => {
    setSelectedVal(newValue?.id || ""); // Update selected role or user value
  };

  return (
    <div className="">
      <form
        className="h-[100px] flex items-center  px-[20px] border-b"
        //  onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" flex max-w-[70%] gap-[30px]">
          {/* Project Name */}
          <div className="flex gap-4 ">
            <FormControl variant="standard" sx={{ minWidth: 300 }} error={!!errors.project}>
              {/* <InputLabel>Type</InputLabel> */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={type} // Options for the type selection
                    getOptionLabel={(option) => option.text} // How to display the options in the dropdown
                    onChange={(e, newValue) => {
                      handleTypeChange(newValue); // Update selected type by its id
                      console.log(e);
                    }}
                    // Set the value based on the selected type id or undefined if not selected
                    value={type.find((option) => option.id === selectedType) || undefined}
                    renderInput={(params) => <TextField {...params} label="Search Type" variant="filled" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id} // Compare option and selected value based on id
                    disableClearable // Prevent clearing of the input field
                  />
                )}
              />
              {errors.project && <p className="text-red-600 text-[13px]">{errors.project.message}</p>}
            </FormControl>
            <FormControl variant="standard" sx={{ minWidth: 300 }} error={!!errors.project}>
              {/* <InputLabel>{selectedType ? selectedType : 'Select an option'}</InputLabel> */}
              {selectedType === "User" ? (
                <SelectUser value={user} onChange={(value) => {setUser(value);setSelectedVal(value?.id)}} />
              ) : (
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={roleOptions} // Options for the role selection
                      getOptionLabel={(option: any) => option.text} // How to display options in the dropdown
                      onChange={(e, newValue) => {
                        handleRoleChange(newValue); // Update selected role by its id
                        console.log(e);
                      }}
                      value={roleOptions.find((option: any) => option.id === selectedVal) || null} // Set selected value based on id
                      renderInput={(params) => <TextField {...params} label={selectedType ? `Search ${selectedType}` : "Select an option"} variant="filled" />}
                      isOptionEqualToValue={(option, value) => option.id === value.id} // Ensures correct comparison
                      disableClearable // Prevent clearing of the selected role
                    />
                  )}
                />
              )}
              {errors.project && <p className="text-red-600 text-[13px]">{errors.project.message}</p>}
            </FormControl>
          </div>
        </div>
      </form>
      <div className="">
        <PermissionTable selectedVal={selectedVal} selectedType={selectedType} updateRow={updateRow} user={user}/>
      </div>
    </div>
  );
};

export default PermissionList;
