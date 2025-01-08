import React, { useEffect, useMemo, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Icons } from "@/components/icons/icons";
import AllocatedLocationTable from "@/components/table/location/AllocatedLocationTable";
import { useAppSelector } from "@/hooks/useReduxHook";
import { findMenuKey } from "@/general";

const AllotLocationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { menuList } = useAppSelector((state: any) => state.menu); 

  // Handle the change in search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(() => findMenuKey(window.location.pathname, menuList), [menuList]);
  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  return (
    <div className="h-full overflow-hidden">
      <div className="h-[60px] flex items-center justify-between border-b px-[20px]">
        <div>
          <TextField
            placeholder="Search..."
            sx={{ width: "300px" }}
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icons.search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        {/* <div className="flex items-center gap-[10px]">
          <IconButton color="success">
            <Icons.download onClick={onBtExport} />
          </IconButton>
          <IconButton color="primary">
            <Icons.print />
          </IconButton>
        </div> */}
      </div>
      <AllocatedLocationTable searchQuery={searchQuery} />
    </div>
  );
};

export default AllotLocationPage;
