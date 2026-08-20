import React from "react";
import { Typography } from "@mui/material";
import CategoryWeightageForm from "@/features/categoryWeightage/CategoryWeightageForm";

const CategoryWeightageCreate: React.FC = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)] p-[20px]">
      <div className="rounded-sm h-full p-[20px]">
        <Typography variant="h6">Create Weightage</Typography>
        <CategoryWeightageForm />
      </div>
    </div>
  );
};

export default CategoryWeightageCreate;
