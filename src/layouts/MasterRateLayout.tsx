import React from "react";
import { List, ListItemButton, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const MasterRateLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex w-full h-[calc(100vh-70px)]">
      <div className="min-w-[250px]">
        <div className="h-[50px] flex items-center px-[10px]">
          <Typography fontWeight={600} variant="h2" fontSize={20}>
            Master Rates
          </Typography>
        </div>
        <List sx={{ pr: 1 }}>
          <ListItemButton
            sx={{
              background: isActive("/master/master-rates") ? "red" : "inherit",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            onClick={() => navigate("/master/master-rates")}
            selected={isActive("/master/master-rates")}
            className="link"
          >
            <Typography fontSize={17} fontWeight={500}>
              New Rates
            </Typography>
          </ListItemButton>
          <ListItemButton
            sx={{
              background: isActive("/master/master-rates/list") ? "red" : "inherit",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            onClick={() => navigate("/master/master-rates/list")}
            selected={isActive("/master/master-rates/list")}
            className="link"
          >
            <Typography fontSize={17} fontWeight={500}>
              Rates List
            </Typography>
          </ListItemButton>
        </List>
      </div>
      <div className="w-full h-full p-0 border rounded-s-md">{children}</div>
    </div>
  );
};

export default MasterRateLayout;
