import LocationListTable from "@/components/table/location/LocationListTable";
import { getLocationList } from "@/features/location/locationSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";
import React, { useEffect } from "react";

const LocationList: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getLocationList());
  }, []);
  return (
    <div className="p-[20px]">
      <div className="h-[calc(100vh-110px)] rounded-sm shadow shadow-stone-400 ">
        <LocationListTable />
      </div>
    </div>
  );
};

export default LocationList;
