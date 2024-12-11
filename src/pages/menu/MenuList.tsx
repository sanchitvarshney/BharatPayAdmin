import { Icons } from "@/components/icons/icons";
import MenuListTable from "@/components/table/menu/MenuListTable";
import { getMenuList } from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { IconButton } from "@mui/material";
import React, { useEffect } from "react";

const MenuList: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenuList());
  }, []);
  return (
    <div className="">
      <div className="h-[50px] border-b px-[20px] flex items-center justify-between">
        <div></div>
        <IconButton onClick={() => dispatch(getMenuList())}>
          <Icons.refresh />
        </IconButton>
      </div>
      <div className="h-[calc(100vh-130px)]  overflow-hidden ">
        <MenuListTable />
      </div>
    </div>
  );
};

export default MenuList;
