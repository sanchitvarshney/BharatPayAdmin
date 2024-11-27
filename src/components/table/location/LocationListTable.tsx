import { useAppSelector } from "@/hooks/useReduxHook";


  const LocationListTable = () => {
    const { locationList, loading } = useAppSelector((state) => state.location);
    console.log(locationList,loading);
    return (
    <div></div>
    );
  };
  
  export default LocationListTable;
  