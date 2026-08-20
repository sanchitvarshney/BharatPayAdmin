import React from "react";
import BharatpeCreditForm from "@/features/bharatpeCredit/BharatpeCreditForm";

const BharatpeCreditCreate: React.FC = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)] p-[20px]">
      <div className="rounded-sm h-full p-[20px]">
     
        <BharatpeCreditForm />
      </div>
    </div>
  );
};

export default BharatpeCreditCreate;
