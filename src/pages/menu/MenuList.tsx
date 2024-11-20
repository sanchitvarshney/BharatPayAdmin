import MenuListTable from "@/components/table/menu/MenuListTable";
import { getMenuList } from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import React, { useEffect } from "react";

const MenuList: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenuList());
  }, []);
  return (
    <div className="p-[20px]">
      <div className="h-[calc(100vh-110px)] rounded-sm shadow shadow-stone-400 ">
        <MenuListTable />
      </div>
    </div>
  );
};

export default MenuList;
