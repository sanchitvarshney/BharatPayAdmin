import { useEffect, useState } from "react";
import { useAppSelector } from "./useReduxHook";
import { getMenuKeyByUrl } from "@/layouts/RootLayout";

const useMenuKey = () => {
  const [menuKey, setMenuKey] = useState<string>("");
  const path = window.location.pathname;
  const {adminMenuList} = useAppSelector((state:any) => state.menu); 
  useEffect(() => {
    setMenuKey(getMenuKeyByUrl(adminMenuList || [], path) || "");
  }, [path,adminMenuList]);
  return menuKey;
};

export default useMenuKey;