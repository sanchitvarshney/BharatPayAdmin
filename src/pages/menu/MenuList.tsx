import { Icons } from "@/components/icons/icons";
import MenuListTable from "@/components/table/menu/MenuListTable";
import { getAdminMenuList, getMenuList } from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { FormControlLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import React, { useEffect } from "react";

const MenuList: React.FC = () => {
  const [value, setValue] = React.useState("1");  // state to store radio value
  const dispatch = useAppDispatch();

  // Handle radio button change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;  // Get the new value directly from the event
    setValue(newValue);  // Update the state with new value

    // Dispatch the correct action based on the new value
    if (newValue === "1") {
      dispatch(getMenuList());  // Dispatch the IMS menu action
    } else {
      dispatch(getAdminMenuList());  // Dispatch the Admin menu action
    }
  };

  // Fetch IMS menu initially
  useEffect(() => {
    dispatch(getMenuList());
  }, []);

  return (
    <div className="">
      <div className="h-[50px] border-b px-[20px] flex items-center justify-between">
        <div></div>
        <IconButton
          onClick={() => {
            // Dispatch based on the current value of 'value' without needing a setState callback
            if (value === "1") {
              dispatch(getMenuList());
            } else {
              dispatch(getAdminMenuList());
            }
          }}
        >
          <Icons.refresh />
        </IconButton>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}  // Controlled component: value set to state
          onChange={handleChange}  // Handle radio button change
        >
          <div className="flex items-center gap-[15px]">
            <FormControlLabel value="1" control={<Radio />} label="IMS Menu" />
            <FormControlLabel value="0" control={<Radio />} label="Admin Menu" />
          </div>
        </RadioGroup>
      </div>
      <div className="h-[calc(100vh-130px)]  overflow-hidden ">
        <MenuListTable setMenu={setValue}/>
      </div>
    </div>
  );
};

export default MenuList;
