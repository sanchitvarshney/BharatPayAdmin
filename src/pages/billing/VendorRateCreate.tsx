import React from "react";
import { Typography } from "@mui/material";
import VendorRateForm from "@/features/vendorRate/VendorRateForm";

const VendorRateCreate: React.FC = () => {
  return (
    <div className="h-[calc(100vh-72px)] p-[20px] flex flex-col overflow-hidden">
      <div className="shrink-0">
        <Typography variant="h6">Add Vendor Pricing</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: "2px" }}>
          Set the rate a vendor charges for a component. Add each vendor + component rate on the left, review them on the right, then submit all at once.
        </Typography>
      </div>
      <div className="flex-1 min-h-0 mt-[16px]">
        <VendorRateForm />
      </div>
    </div>
  );
};

export default VendorRateCreate;
