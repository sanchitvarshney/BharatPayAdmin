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
  Typography,
  Box,
  Divider,
  TextField,
  Grid,
} from "@mui/material";
import { Icons } from "../../icons/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  fetchLocationUpdate,
  getAllocatedLocationList,
  getLocationList,
  updateAllotLocation,
} from "@/features/location/locationSlice";
import { showToast } from "@/utills/toasterContext";

interface SharedDialogProps {
  open: boolean;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  id: string | null;
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
  const [locations, setLocations] = useState<{ name: string; code: string }[]>(
    []
  );
  const [checkedLocations, setCheckedLocations] = useState<any>({});

  const [moduleName, setModuleName] = useState<string>(""); // State for module name
  const [moduleDescription, setModuleDescription] = useState(""); // State for module description

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
    if (id) {
      dispatch(fetchLocationUpdate(id)).then((res: any) => {
        if (res?.payload?.data?.success) {
          setCheckedLocations(res.payload.data.data);
          const locations = res.payload.data.data.locations;
          setSelectedLocations(locations.split(","));
          setModuleName(res.payload.data.data.for_module);
          setModuleDescription(res.payload.data.data.module_desc);
        }
      });
    }
  }, [id]);

  // Update locations list when locationList from Redux changes
  useEffect(() => {
    setLocations(locationList || []);
  }, [locationList]);

  const handleSubmit = () => {
    if (!selectedLocations.length)
      return showToast("Please select at least one location", "error");
    const payload: any = {
      module_name: moduleName,
      locations: selectedLocations,
      key: id,
      module_description: moduleDescription,
    };
    dispatch(updateAllotLocation(payload)).then((res: any) => {
      if (res?.payload?.data?.success) {
        showToast(res.payload.data.message, "success");
        onClose();
        dispatch(getAllocatedLocationList());
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      sx={{ "& .MuiDialog-paper": { minWidth: "1000px" } }}
    >
      {/* Loading Indicator */}
      {loading && (
        <Box position="absolute" top={0} left={0} right={0}>
          <LinearProgress />
        </Box>
      )}

      {/* Dialog Title */}
      <DialogTitle id="dialog-title" fontWeight={600}>
        Update Location for {checkedLocations.for_module}
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      {/* Dialog Content */}
      <DialogContent sx={{ minWidth: "600px", padding: 2 }}>
        <div className="p-4">
          <Grid container spacing={2}>
            {/* Module Name Field */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Module Name:
              </Typography>
              <TextField
                size="small"
                fullWidth
                variant="filled"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </Grid>

            {/* Module Description Field */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Module Description:
              </Typography>
              <TextField
                size="small"
                fullWidth
                variant="filled"
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </div>
        {loading ? (
          <Box
            className="h-[calc(100vh-325px)] flex items-center justify-center"
            sx={{ minHeight: "300px" }}
          >
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Box className="h-[calc(100vh-350px)] overflow-y-auto">
            {/* Location Checkbox Grid */}
            <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
              Update Locations:
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] p-[10px]">
              {locations.map((location) => (
                <FormControlLabel
                  key={location.code}
                  control={
                    <Checkbox
                      checked={selectedLocations.includes(location.code)}
                      onChange={(event) =>
                        handleLocationChange(event, location.code)
                      }
                      color="primary"
                    />
                  }
                  label={location.name || "Unnamed Location"}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontWeight: 500,
                    },
                  }}
                />
              ))}
            </div>
          </Box>
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
