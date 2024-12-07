import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import SearchLinks from "./SearchLinks";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { logout } from "@/features/authentication/authSlice";
import SharedDialog from "@/components/shared/SharedDialog";
import { Icons } from "../icons/icons";

const Navigation: React.FC = () => {
  const [openUser, setOpenUser] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <div className="h-[50px]   px-[20px]  flex items-center justify-between ">
      <div className="flex items-center">
        <SearchLinks />
      </div>
      <div className="flex gap-[5px] items-center">
        <Tooltip title="Logout">
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
            onClick={() => setOpenUser(!openUser)}
          >
            <Icons.logout className={`h-[25px] w-[25px]  ${openUser ? "text-blue-600" : "text-slate-500"}`} />
          </Button>
        </Tooltip>
      </div>
      <SharedDialog open={openUser} title="Logout" content="Are you sure you want to logout?" onClose={() => setOpenUser(false)} onConfirm={() => dispatch(logout())} endIcon={<Icons.logout fontSize="small" />} />
    </div>
  );
};

export default Navigation;
