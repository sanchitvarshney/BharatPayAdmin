import React, { useState } from "react";
import { Popover } from "antd";
import { Button } from "@mui/material";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";
import SearchLinks from "./SearchLinks";
import { FiUser } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { logout } from "@/features/authentication/authSlice";

const Navigation: React.FC = () => {
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openUser, setOpenUser] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const content = (
    <div className="flex ">
      <Link to={"#"} className="flex flex-col items-center  px-[15px] border-e text-slate-600 ">
        <FiUser className="h-[18px] w-[18px]" />
        <p className="text-[13px]">Profile</p>
      </Link>
      <Link to={"#"} className="flex flex-col items-center  px-[15px] border-e text-slate-600 ">
        <CiSettings className="h-[18px] w-[18px]" />
        <p className="text-[13px]">Setting</p>
      </Link>
      <Button onClick={() => dispatch(logout())} sx={{ textTransform: "capitalize", color: "#475569" }} className="flex flex-col items-center  px-[15px]  text-slate-600 ">
        <LuLogOut className="h-[18px] w-[18px]" />
        <p className="text-[13px]">Logout</p>
      </Button>
    </div>
  );
  const notification = (
    <div className="py-[10px]">
      <div className="px-[10px]">
        <p className="font-[500]">Notification(8)</p>
      </div>
      <div className="w-[300px] mt-[20px] max-h-[300px] overflow-y-auto">
        <ul>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center hover:bg-zinc-100 gap-[5px] px-[10px]  py-[10px]">
              <div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-slate-600">Sachin maurya</p>
                <p className="text-slate-500 text-[13px]">Check out every components</p>
                <p className="text-slate-400 text-[12px]">Sep 26 , 15:13 PM</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  return (
    <div className="h-[50px]   px-[20px]  flex items-center justify-between ">
      <div className="flex items-center">
        <SearchLinks />
      </div>
      <div className="flex gap-[5px] items-center">
        <Popover overlayInnerStyle={{ padding: 0 }} placement="bottomRight" content={notification} open={openNotification} onOpenChange={setOpenNotification}>
          <Button
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              minWidth: 0,
              padding: 0,
              backgroundColor: `${openNotification ? "#ffff" : ""}`,
              ":hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <FiAlertTriangle className={`h-[20px] w-[20px]  ${openNotification ? "text-blue-600" : "text-slate-500"}`} />
          </Button>
        </Popover>
        <Popover placement="bottomRight" content={content} open={openUser} onOpenChange={setOpenUser}>
          <Button
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              minWidth: 0,
              padding: 0,
              backgroundColor: `${openUser ? "#ffff" : ""}`,
              ":hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <FaRegCircleUser className={`h-[20px] w-[20px]  ${openUser ? "text-blue-600" : "text-slate-500"}`} />
          </Button>
        </Popover>
      </div>
    </div>
  );
};

export default Navigation;
