import { Icons } from "@/components/icons/icons";
import AllocatedLocationTable from "@/components/table/location/AllocatedLocationTable";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";

const AllotLocationPage: React.FC = () => {
  return (
    <div className="h-full overflow-hidden">
      <div className="h-[60px] flex items-center justify-between border-b px-[20px] ">
        <div>
          <TextField
            placeholder="Search..."
            sx={{ width: "300px" }}
            size="small"
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
        <div className="flex items-center gap-[10px]">
          <IconButton color="success">
            <Icons.download />
          </IconButton>
          <IconButton color="primary">
            <Icons.print />
          </IconButton>
        </div>
      </div>
      <AllocatedLocationTable />
    </div>
  );
};

export default AllotLocationPage;
