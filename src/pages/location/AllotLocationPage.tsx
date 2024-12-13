import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Icons } from "@/components/icons/icons";
import AllocatedLocationTable from "@/components/table/location/AllocatedLocationTable";

const AllotLocationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle the change in search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
