import React from "react";
import { Typography } from "@mui/material";
import MasterRateForm from "@/features/masterRate/MasterRateForm";

const MasterRateCreate: React.FC = () => {
  return (
    <div className=" overflow-y-auto h-[calc(100vh-72px)] p-[20px]">
      <div className="rounded-sm   h-full p-[20px] ">
     
          <Typography variant="h6">Create Master Rate</Typography>
          <MasterRateForm />
      
      </div>
    </div>
  );
};

export default MasterRateCreate;
