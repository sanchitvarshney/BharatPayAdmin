import PermissionTable from "@/components/table/permissions/PermissionTable";
import {
  getActiveUser,
  getRoleMenu,
  getUserMenu,
  saveRoleMenuPermission,
  saveUserMenuPermission,
} from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { getRoleList } from "@/features/permission/permissionSlice";
import { setIsId } from "@/features/menu/isIdReducer";
import { showToast } from "@/utills/toasterContext";
const schema = z.object({
  type: z.string().nonempty("Project name is required"),
  role: z.string().nonempty("Page name is required"),
  project: z.string().nonempty("Project name is required"),
});
// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

const PermissionList: React.FC = () => {
  const [options, setOptions] = React.useState([]);
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [selectedVal, setSelectedVal] = React.useState<any>("");
  const [selectedType, setSelectedType] = React.useState<any>("");
  // const isId = useSelector((state: RootState) => state.isId.isId);
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
    isAdd: boolean,
    isDelete: boolean
  ) => {
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
  }, [selectedVal, selectedType]);
  let type = [
    { id: "User", text: "User" },
    { id: "Role", text: "Role" },
  ];

  const handleTypeChange = (newValue: any) => {
    setSelectedType(newValue?.id || "");
    setSelectedVal(""); // Clear selected value when changing the type
  };

  const handleRoleChange = (newValue: any) => {
    setSelectedVal(newValue?.id || ""); // Update selected role or user value
  };

  return (
    <div className="p-[20px] ">
      <form
      //  onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-[20px] flex max-w-[70%] gap-[30px]">
          {/* Project Name */}
          <div className=" flex gap-4">
            <FormControl
              variant="standard"
              sx={{ minWidth: 200 }}
              error={!!errors.project}
            >
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
                    value={
                      type.find((option) => option.id === selectedType) ||
                      undefined
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Type"
                        variant="outlined"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    } // Compare option and selected value based on id
                    disableClearable // Prevent clearing of the input field
                  />
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
              {/* <InputLabel>{selectedType ? selectedType : 'Select an option'}</InputLabel> */}
              {selectedType === "User" ? (
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={options} // Options for the role selection
                      getOptionLabel={(option: any) => option.text} // Define how to display the option in the dropdown
                      onChange={(e, newValue: any) => {
                        handleRoleChange(newValue); // Update selected value
                        console.log(e);
                      }}
                      value={
                        options.find(
                          (option: any) => option.id === selectedVal
                        ) || null
                      } // Set selected value based on the id
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            selectedType
                              ? `Search ${selectedType}`
                              : "Select an option"
                          }
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      } // Compare option and selected value based on id
                      disableClearable // Prevent clearing of the input
                    />
                  )}
                />
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
                      value={
                        roleOptions.find(
                          (option: any) => option.id === selectedVal
                        ) || null
                      } // Set selected value based on id
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            selectedType
                              ? `Search ${selectedType}`
                              : "Select an option"
                          }
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      } // Ensures correct comparison
                      disableClearable // Prevent clearing of the selected role
                    />
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
      <div className="mt-[20px] rounded-sm shadow shadow-stone-400">
        {selectedType && selectedVal ? (
          <PermissionTable
            selectedVal={selectedVal}
            selectedType={selectedType}
            updateRow={updateRow}
          />
        ) : (
          // <div className="text-center text-gray-500 w-full">Please select a type and role to view permissions.</div>
          <div className="text-center text-gray-500 w-full p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
            Please select a type and {selectedType} to view permissions.
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionList;
