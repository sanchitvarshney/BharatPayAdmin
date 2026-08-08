import React from "react";
import { Typography } from "@mui/material";
import CategoryRateForm from "@/features/categoryRate/CategoryRateForm";

const CategoryRateCreate: React.FC = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)] p-[20px]">
      <div className="rounded-sm h-full p-[20px]">
        <Typography variant="h6">Create Category Rate</Typography>
        <CategoryRateForm />
      </div>
    </div>
  );
};

export default CategoryRateCreate;
