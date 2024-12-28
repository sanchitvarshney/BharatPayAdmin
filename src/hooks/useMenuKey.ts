import { useEffect, useState } from "react";
import { useAppSelector } from "./useReduxHook";
import { getMenuKeyByUrl } from "@/layouts/RootLayout";

const useMenuKey = () => {
  const [menuKey, setMenuKey] = useState<string>("");
  const path = window.location.pathname;
  const {menuList} = useAppSelector((state:any) => state.menu); 
  useEffect(() => {
    setMenuKey(getMenuKeyByUrl(menuList || [], path) || "");
  }, [path,menuList]);
  return menuKey;
};

export default useMenuKey;