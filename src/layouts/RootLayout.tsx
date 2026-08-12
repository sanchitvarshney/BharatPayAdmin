import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigation from "@/components/shared/Navigation";

import axiosInstance from "@/api/baratpayDashApi";
import { Icons } from "@/components/icons/icons";
import { getAdminMenuList, getPermissionMenu } from "@/features/menu/menuSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import useMenuKey from "@/hooks/useMenuKey";

type Props = {
  children: React.ReactNode;
};
const menuItems = [
  { title: "Dashboard", tab: "dashboard", icon: Icons.home, navigateTo: "/" },
  {
    title: "User",
    tab: "user",
    icon: Icons.user,
    navigateTo: "/user/add-user",
  },
  { title: "Role", tab: "role", icon: Icons.role, navigateTo: "/role/list" },
  {
    title: "Location",
    tab: "location",
    icon: Icons.location,
    navigateTo: "/location/list",
  },
  { title: "Menu", tab: "menu", icon: Icons.menu, navigateTo: "/menu/create" },
    { title: "Master Rates", tab: "master", icon: Icons.rate, navigateTo: "/master/master-rates" },
  {
    title: "Category Rate",
    tab: "billing",
    icon: Icons.category,
    navigateTo: "/billing/category-rate",
  },
  {
    title: "Permission",
    tab: "permission",
    icon: Icons.permission,
    navigateTo: "/permission/list",
  },

  {
    title: "Notification",
    tab: "notification",
    icon: Icons.notifications,
    navigateTo: "/notification",
  },
];
const profileItem = {
  title: "Profile",
  tab: "profile",
  icon: Icons.userOutline,
  navigateTo: "/profile",
};
const RootLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<string>("dashboard");
  const [newmenu, setNewMenu] = useState([]);
  const [masterMenu, setMasterMenu] = useState([]);

  const getUserMenuPermission = async () => {
    try {
      const response = await axiosInstance.get(
        "permission/getUserMenuPermission"
      );
      const newMenu = response.data.menu;
      const master = response.data.masterMenu;
      setNewMenu(newMenu);
      setMasterMenu(master);
      return newMenu;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (masterMenu && newmenu) {
      getUserMenuPermission();
      dispatch(getAdminMenuList());
      dispatch(getPermissionMenu());
    }
  }, []);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setTab("dashboard");
    } else {
      setTab(location.pathname.split("/")[1]);
    }
  }, [location]);

  const menuKey = useMenuKey();

  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);


  return (
    <Wrapper className="h-[100vh] w-[100%] bg-blue-800 p-[10px] ">
      <main className="h-[calc(100vh-20px)] bg-white rounded-md overflow-hidden flex">
        <div className="sidebar min-w-[60px] h-full bg-white border-r py-[20px]">
          <div className="flex items-center justify-center w-full h-[50px]">
            <Link to="/">
              <img src={"/mslogo.png"} alt="" className="w-[40px] py-[10px]" />
            </Link>
          </div>
          <div className="h-[calc(100vh-160px)] flex flex-col items-center gap-[5px] py-[20px]">
            {menuItems.map(
              ({ title, tab: itemTab, icon: Icon, navigateTo }) => (
                <Tooltip key={itemTab} title={title} placement="right" arrow>
                  <Button
                    onClick={() => {
                      setTab(itemTab);
                      if (navigateTo) navigate(navigateTo);
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      minWidth: 0,
                      padding: 0,
                      backgroundColor: tab === itemTab ? "#dbeafe" : "",
                    }}
                  >
                    <Icon
                      className={
                        tab === itemTab ? "text-cyan-700" : "text-slate-700"
                      }
                    />
                  </Button>
                </Tooltip>
              )
            )}
          </div>
          <div className="flex flex-col gap-4 mt-auto">
            <div className="h-[20px] flex items-center justify-center">
              <Tooltip title={profileItem.title} placement="right" arrow>
                <Button
                  onClick={() => {
                    setTab(profileItem.tab);
                    navigate(profileItem.navigateTo);
                  }}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    minWidth: 0,
                    padding: 0,
                    backgroundColor: tab === profileItem.tab ? "#dbeafe" : "",
                  }}
                >
                  <profileItem.icon
                    className={
                      tab === profileItem.tab
                        ? "text-cyan-700"
                        : "text-slate-700"
                    }
                  />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="">
            <Navigation />
          </div>
          <div className="w-full overflow-x-hidden ">
            <div>{menuKey?children:children}</div>
            {/* <div>{children}</div> */}
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .navlink {
    color: #475569;
    .link {
      padding: 10px 10px;
      font-size: 14px;
      display: flex;
      justify-content: start;
    }
    &.active {
      .link {
        background-color: #fff;
        color: #2563eb;
        position: relative;
        background: #2564eb2f;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
      }
    }
  }
`;
export default RootLayout;
// let masteeee = [
//   {
//     menu_key: "pg-s9330sp9p85cs8s",
//     name: "Master",
//     parent_menu_key: null,
//     url: null,
//     order: 1,
//     is_active: 1,
//     icon: "fa fa-master",
//     description: "master menu",
//   },
//   {
//     menu_key: "pg-sor0e6s1s142res",
//     name: "WH",
//     parent_menu_key: null,
//     url: null,
//     order: 2,
//     is_active: 1,
//     icon: "fa fa-comp",
//     description: "master menu comp",
//   },
// ];

export const getMenuKeyByUrl = (menuList: any, targetUrl: string): string | null => {
  if (targetUrl === "/") return "dashboard"; // Special case for the root URL

  for (const menu of menuList) {
    if (menu.url === targetUrl) {
      axiosInstance.interceptors.request.use(async (config) => {
        // config.headers["menuKey"] = menu.menu_key;
        return config;
      });
      return menu.menu_key;
      
    }

    if (menu.children && menu.children.length > 0) {
      const foundKey = getMenuKeyByUrl(menu.children, targetUrl); // Recursively search children
      if (foundKey) {
        axiosInstance.interceptors.request.use(async (config) => {
          // config.headers["menuKey"] = foundKey;
          return config;
        });
        return foundKey;
        
      }
    }
  }

  return null; // Return null if no match is found
};