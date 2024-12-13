import React from "react";
import { List, ListItemButton, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const UserLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex w-full h-[calc(100vh-70px)] ">
      <div className="min-w-[250px]">
        <div className="h-[50px] flex items-center px-[10px]">
          <Typography fontWeight={600} variant="h2" fontSize={20}>
            User
          </Typography>
        </div>
        <List sx={{ pr: 1 }}>
          <ListItemButton
            sx={{
              background: isActive("/user/add-user") ? "red" : "inherit",
              // color: isActive("/user/add-user") ? "white" : "text.primary",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            onClick={() => navigate("/user/add-user")}
            selected={isActive("/user/add-user")}
            className="link"
          >
            <Typography fontSize={17} fontWeight={500}>
              Add New User
            </Typography>
          </ListItemButton>
          <ListItemButton
            sx={{
              background: isActive("/user/view-user") ? "red" : "inherit",
              // color: isActive("/user/add-user") ? "white" : "text.primary",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            onClick={() => navigate("/user/view-user")}
            selected={isActive("/user/view-user")}
            className="link"
          >
            <Typography fontSize={17}>View Users</Typography>
          </ListItemButton>
        </List>
      </div>
      <div className="w-full h-full p-0 border rounded-s-md">{children}</div>
    </div>
  );
};

export default UserLayout;
