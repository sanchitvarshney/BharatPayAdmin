import React, { useEffect, useState } from "react";
import { ChevronRight, Star } from "lucide-react";
import Button from "@mui/material/Button";
import { CiSettings } from "react-icons/ci";
import Tooltip from "@mui/material/Tooltip";
import { IoGrid, IoHomeOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { GrShieldSecurity } from "react-icons/gr";
import { MdHome, MdMyLocation } from "react-icons/md";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import Navigation from "@/components/shared/Navigation";
import ButtonBase from "@mui/material/ButtonBase";
import { IoMenu } from "react-icons/io5";
import { FaKey } from "react-icons/fa6";
// import axiosInstance from "@/api/baratpayDashApi";
import { CgArrowTopRight } from "react-icons/cg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/api/baratpayDashApi";

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = ({ children }) => {
  const [tab, setTab] = useState<string>("dashboard");
  const [newmenu, setNewMenu] = useState([]);
  const [masterMenu, setMasterMenu] = useState([]);

  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  // const { sheetOpen, setSheetOpen, modalRef } = uiState;
  console.log(sheetOpen);
  const getUserMenuPermission = async () => {
    try {
      const response = await axiosInstance.get(
        "permission/getUserMenuPermission"
      );
      let newMenu = response.data.menu;
      let master = response.data.masterMenu;
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
    }
  }, []);
  const location = useLocation();
  const renderIcon = (iconClass: string) => {
    if (iconClass) {
      return <i className={"fa fa-university"}></i>; // Render the <i> element with the icon class
    }
    return null;
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setTab("dashboard");
    } else {
      setTab(location.pathname.split("/")[1]);
    }
  }, [location]);
  const renderMenu = (menu: any, r: any, setSidemenu: any) => {
    return (
      <Accordion type="single" className="w-full" collapsible>
        <ul className="flex flex-col gap-[10px]  p-[10]">
          {menu.map((item: any, index: number) =>
            item?.menu_key === r?.menu_key ||
            item?.parent_menu_key === r?.menu_key ? (
              <li key={index}>
                {item?.children ? (
                  <AccordionItem
                    value={`${index + item.name}`}
                    className="border-0 hover:bg-[#DBEAFE]" // Hover effect applied to the item
                  >
                    <AccordionTrigger className="p-[10px] rounded-md cursor-pointer hover:no-underline">
                      <span className="flex gap-[10px] items-center">
                        {item.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-[10px] mt-[10px] border-l-2 border-yellow-600 bg-white rounded">
                      {renderMenu(item.children, r, setSidemenu)}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Link
                      onClick={() => setSidemenu(false)}
                      to={item.url}
                      className="w-full hover:no-underline hover:bg-[#DBEAFE] p-[10px] rounded-md cursor-pointer flex items-center gap-[10px]"
                    >
                      {item.name}
                      <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
                    </Link>
                    <CustomTooltip message="Add to favorite" side="right">
                      <div className="h-[30px] min-w-[30px] flex justify-center items-center hover:bg-[#DBEAFE] hover:text-cyan-600 transition-all cursor-pointer rounded-md">
                        <Star className="h-[16px] w-[16px]" />
                      </div>
                    </CustomTooltip>
                  </div>
                )}
              </li>
            ) : null
          )}
        </ul>
      </Accordion>
    );
  };

  return (
    <Wrapper className="h-[100vh] w-[100%] bg-blue-800 p-[10px] ">
      <main className="h-[calc(100vh-20px)] bg-white rounded-md overflow-hidden flex">
        <div className="sidebar w-[60px] h-full bg-white border-r py-[20px]">
          <div className="flex items-center justify-center w-full h-[50px] ">
            <a href="#">
              <img src={"/mslogo.png"} alt="" className="w-[40px] py-[10px]" />
            </a>
          </div>
          <div className="h-[calc(100vh-160px)] flex flex-col items-center gap-[5px] py-[20px] ">
            <Tooltip title="Dashboard" placement="right" arrow>
              <Button
                onClick={() => setTab("dashboard")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "dashboard" ? "#dbeafe" : ""}`,
                }}
              >
                <IoHomeOutline className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            <Tooltip title="User" placement="right" arrow>
              <Button
                onClick={() => setTab("user")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "user" ? "#dbeafe" : ""}`,
                }}
              >
                <LuUser2 className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            <Tooltip title="Role" placement="right" arrow>
              <Button
                onClick={() => setTab("role")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "role" ? "#dbeafe" : ""}`,
                }}
              >
                <GrShieldSecurity className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            <Tooltip title="Location" placement="right" arrow>
              <Button
                onClick={() => setTab("location")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "location" ? "#dbeafe" : ""}`,
                }}
              >
                <MdMyLocation className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            <Tooltip title="Menu" placement="right" arrow>
              <Button
                onClick={() => setTab("menu")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "menu" ? "#dbeafe" : ""}`,
                }}
              >
                <IoMenu className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            <Tooltip title="Permission" placement="right" arrow>
              <Button
                onClick={() => setTab("permission")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${
                    tab === "permission" ? "#dbeafe" : ""
                  }`,
                }}
              >
                <FaKey className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip>
            {/* <Tooltip title="dynamic Menu" placement="right" arrow>
              <Button
                onClick={() => setTab("dynamicMenu")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: `${tab === "dynamicMenu" ? "#dbeafe" : ""}`,
                }}
              >
                <CiMenuKebab className="h-[20px] w-[20px] text-slate-500" />
              </Button>
            </Tooltip> */}
          </div>
          <div className="h-[50px]  flex items-center justify-center">
            <Tooltip title="Setting" placement="right" arrow>
              <Button
                onClick={() => setTab("setting")}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  minWidth: 0,
                  padding: 0,
                  backgroundColor: "#dbeafe",
                }}
              >
                <CiSettings className="h-[20px] w-[20px] text-slate-600" />
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* <div className=" min-w-[350px] h-full"> */}
        {tab === "dynamicMenu" && (
          <div>
            <div className="h-[100px] flex items-center px-[10px] text-[#475569] bg-red text-red">
              <h1 className="text-[20px] text-blue-600 font-[500] ">
                dynamicMenu
              </h1>
            </div>
            <div>
              <ul className="flex flex-col text-black p-[5px] mt-[50px] ">
                <li>
                  <NavLink
                    to={"/"}
                    className={
                      "flex gap-[10px] items-center py-[10px] group-hover:bg-[#DBEAFE]  p-[10px] rounded-md text-[#475569]"
                    }
                  >
                    <MdHome className="h-[20px] w-[20px]" />
                    Dashboard
                  </NavLink>
                </li>{" "}
                <div className="sidebar min-w-[250px] h-full ">
                  {masterMenu?.map((r:any) => (
                    <li className="group">
                      <div
                        className={
                          "flex justify-between items-center py-[10px] hover:[#D7E2FB] p-[10px] group-hover:bg-[#DBEAFE] rounded-md cursor-pointer text-[#475569]"
                        }
                      >
                        <span className="flex gap-[10px] items-center cursor-pointer">
                          {/* <IoGrid className="h-[20px] w-[20px]" /> */}
                          {r.icon && renderIcon(r.icon)} {r.name}
                        </span>
                        <ChevronRight />
                      </div>
                      <div className=" top-[20px] bottom-[20px] z-[1] bg-[#fff] shadow absolute border-l border-slate-600 rounded-md   left-[310px] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 ">
                        <div className="min-w-[400px]">
                          <div className="p-[10px] h-[130px]">
                            <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <IoGrid className="h-[20px] w-[20px]" />
                              {r.name}
                            </span>
                            <a
                              href="#"
                              className="font-[350] text-[13px] mt-[10px] text-slate-500"
                            >
                              {r.description}
                            </a>
                          </div>
                          <div className="sidebar2 min-w-[50px] h-full">
                            <div className="h-[100px] items-center px-[10px]">
                              <Separator className="text-slate-200" />
                              <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin text-slate-600 scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px] w-[350px]">
                                {renderMenu(newmenu, r, setSheetOpen)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </div>
        )}
        {/* </div> */}
        {/* sd */}
        <div className="sidebar2 min-w-[250px] h-full ">
          {tab === "dashboard" && (
            <div>
              <div className="h-[80px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">
                  Dashboard
                </h1>
              </div>
              <div className="w-full">
                <ul className="w-full">
                  <li className="w-full">
                    <NavLink
                      to={"/"}
                      className={({ isActive }) =>
                        isActive ? "active navlink" : "navlink"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Home</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {tab === "user" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">User</h1>
              </div>
              <div>
                <ul className="w-full pe-[10px]">
                  <li className="w-full">
                    <NavLink
                      to={"/user/add-user"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Add New User</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to={"/user/view-user"}
                      className={({ isActive }) =>
                        isActive ? "active navlink" : "navlink"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>View Users</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {tab === "role" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">
                  Role
                </h1>
              </div>
              <div>
                <ul className="w-full pe-[10px]">
                  <li className="w-full">
                    <NavLink
                      to={"/role/list"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div> User Roles</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {tab === "menu" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">Menu</h1>
              </div>
              <div>
                <ul className="w-full pe-[10px]">
                  <li className="w-full">
                    <NavLink
                      to={"/menu/create"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Create Master Menu</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to={"/menu/list"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Menu List</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {tab === "permission" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">
                  Permissions
                </h1>
              </div>
              <div>
                <ul className="w-full pe-[10px]">
                  <li className="w-full">
                    <NavLink
                      to={"/permission/list"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Permissions List</div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {tab === "location" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">
                  Location
                </h1>
              </div>
              <div>
                <ul className="w-full pe-[10px]">
                  <li className="w-full">
                    <NavLink
                      to={"/location/list"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Allot Location </div>
                      </ButtonBase>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink
                      to={"/location/alloted-location"}
                      className={({ isActive }) =>
                        isActive ? "active navlink " : "navlink rounded-e-md"
                      }
                    >
                      <ButtonBase className="w-full link">
                        <div>Location Alloted Module  </div>
                      </ButtonBase>
                    </NavLink>
                  </li>
                  
                </ul>
              </div>
            </div>
          )}
          {tab === "setting" && (
            <div>
              <div className="h-[100px] flex items-center px-[10px]">
                <h1 className="text-[20px] text-blue-600 font-[500] ">
                  Setting
                </h1>
              </div>
              <div></div>
            </div>
          )}
        </div>{" "}
        <div className="w-full body">
          <Navigation />
          <div>{children}</div>
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
