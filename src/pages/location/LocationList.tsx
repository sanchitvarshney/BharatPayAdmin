import { Typography, TextField, Checkbox, FormControlLabel, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { allotLocation, getLocationList } from "@/features/location/locationSlice";
import { showToast } from "@/utills/toasterContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";
import { findMenuKey } from "@/general";

const LocationList = () => {
  const dispatch = useAppDispatch();
  const { menuList } = useAppSelector((state: any) => state.menu); 
  const { locationList, loading } = useAppSelector((state) => state.location);
  const [moduleName, setModuleName] = useState<string>(""); // State for module name
  const [moduleDescription, setModuleDescription] = useState(""); // State for module description
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // State for selected locations
  const [locations, setLocations] = useState<{ name: string; code: string }[]>([]);

  // Handle checkbox selection
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>, locationId: string) => {
    if (event.target.checked) {
      setSelectedLocations((prev) => [...prev, locationId]);
    } else {
      setSelectedLocations((prev) => prev.filter((id) => id !== locationId));
    }
  };

  // Handle form submission and format data
  const handleSubmit = () => {
    if (!moduleName) return showToast("Module name is required", "error");
    if (!selectedLocations.length) return showToast("Please select at least one location", "error");
    const payload = {
      module_name: moduleName,
      locations: selectedLocations,
      module_description: moduleDescription,
    };
    dispatch(allotLocation(payload)).then((res: any) => {
      if (res?.payload?.data?.success) {
        showToast(res.payload.data.message, "success");
        setModuleName("");
        setModuleDescription("");
        setSelectedLocations([]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };


  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(() => findMenuKey(window.location.pathname, menuList), [menuList]);
  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  useEffect(() => {
    dispatch(getLocationList());
  }, []); 

  useEffect(() => {
    setLocations(locationList || []);
  }, [locationList]);

  return (
    <div className="h-full ">
      <div className=" h-[150px] p-[20px]">
        <Typography variant="h3" gutterBottom fontSize={20}>
          Page Title
        </Typography>
        <Typography variant="inherit" fontSize={14} color="textSecondary" gutterBottom>
          Provide the page title OR hint where implementing the location
        </Typography>
        <div className="grid grid-cols-2 gap-[20px]">
          <TextField size="small" label="Page Name" fullWidth variant="filled" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
          <TextField size="small" label="Page Description" fullWidth variant="filled" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
        </div>
      </div>

      <div className="h-[50px] border-t border-b flex items-center justify-between  px-[20px]">
        <div className="flex items-center gap-[20px]">
          <Typography variant="h6" gutterBottom>
            Location(s)
          </Typography>
          <TextField
            variant="standard"
            onChange={(e) => {
              if (e.target.value) {
                setLocations(locationList?.filter((item) => item.name?.toLowerCase().includes(e.target.value.toLowerCase())) || []);
              } else {
                setLocations(locationList || []);
              }
            }}
            placeholder="Search..."
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icons.search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className="flex items-center gap-[20px]">
          <IconButton onClick={() => dispatch(getLocationList())}>
            <Icons.refresh />
          </IconButton>
          <div>
            <Typography fontWeight={500} variant="inherit">
              Total selected location(s): {selectedLocations.length}
            </Typography>
          </div>
        </div>
      </div>

      {loading ? (
        <div className=" h-[calc(100vh-325px)] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className=" h-[calc(100vh-325px)] overflow-y-auto">
          <div className="grid grid-cols-4 gap-[10px] p-[20px]">
            {locations?.map((location) => (
              <FormControlLabel key={location.code} sx={{ maxHeight: "max-content" }} control={<Checkbox checked={selectedLocations.includes(location.code)} onChange={(event) => handleLocationChange(event, location.code)} />} label={location.name || "Unnamed Location"} />
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="h-[50px] flex items-center justify-end px-[20px] border-t">
        <LoadingButton loading={loading} loadingPosition="start" startIcon={<Icons.save />} variant="contained" onClick={handleSubmit}>
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default LocationList;
