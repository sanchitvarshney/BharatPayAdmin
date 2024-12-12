// src/components/reusable/SharedDialog.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Icons } from "../../icons/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { fetchLocationUpdate, getAllocatedLocationList, getLocationList, updateAllotLocation } from "@/features/location/locationSlice";
import { showToast } from "@/utills/toasterContext";

interface SharedDialogProps {
  open: boolean;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  id: string|null;
}

const LocationAllocation: React.FC<SharedDialogProps> = ({
  open,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  startIcon,
  endIcon,
  id,
}) => {
  // Redux state and local state hooks
  const { locationList, loading } = useAppSelector((state) => state.location);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ name: string; code: string }[]>([]);
  const [checkedLocations, setCheckedLocations] = useState<any>({});

  const dispatch = useAppDispatch();

  // Handle checkbox changes
  const handleLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    locationId: string
  ) => {
    setSelectedLocations((prev) =>
      event.target.checked
        ? [...prev, locationId]
        : prev.filter((id) => id !== locationId)
    );
  };

  // Fetch data on mount
  useEffect(() => {
    dispatch(getAllocatedLocationList());
    dispatch(getLocationList());
  }, [dispatch]);

  useEffect(() => {
    id&&dispatch(fetchLocationUpdate(id)).then((res: any) => {
        console.log(res)
      if (res?.payload?.data?.success) {
        setCheckedLocations(res.payload.data.data);
        const locations=res.payload.data.data.locations;
        setSelectedLocations(locations.split(","));
        console.log(checkedLocations)
      }
    })
  }, [id]);

  // Update locations list when locationList from Redux changes
  useEffect(() => {
    setLocations(locationList || []);
  }, [locationList]);

  const handleSubmit = () => {
    if (!selectedLocations.length) return showToast("Please select at least one location", "error");
    const payload:any = {
      module_name: checkedLocations.for_module,
      locations: selectedLocations,
      key:id
    //   module_description: moduleDescription,
    };
    dispatch(updateAllotLocation(payload)).then((res: any) => {
      if (res?.payload?.data?.success) {
        showToast(res.payload.data.message, "success");
        // setSelectedLocations([]);
        onClose();
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" sx={{ "& .MuiDialog-paper": { minWidth: "800px" } }}>
      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-0 left-0 right-0">
          <LinearProgress />
        </div>
      )}

      {/* Dialog Title */}
      <DialogTitle id="dialog-title" fontWeight={600}>
        Edit Location for {checkedLocations.for_module}
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ minWidth: "600px" }}>
        {loading ? (
          <div className="h-[calc(100vh-325px)] flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="h-[calc(100vh-325px)] overflow-y-auto">
            {/* Location Checkbox Grid */}
            <div className="grid grid-cols-4 gap-[10px] p-[20px]">
              {locations.map((location) => (
                <FormControlLabel
                  key={location.code}
                  sx={{ maxHeight: "max-content" }}
                  control={
                    <Checkbox
                      checked={selectedLocations.includes(location.code)}
                      onChange={(event) =>
                        handleLocationChange(event, location.code)
                      }
                    />
                  }
                  label={location.name || "Unnamed Location"}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button
          size="small"
          disabled={loading}
          startIcon={<Icons.close fontSize="small" />}
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ background: "white", color: "red" }}
        >
          {cancelText}
        </Button>

        <Button
          size="small"
          disabled={loading}
          onClick={handleSubmit}
          variant="contained"
          startIcon={startIcon}
          endIcon={endIcon}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationAllocation;
