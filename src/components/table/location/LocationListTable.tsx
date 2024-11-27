import {
  Grid,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { allotLocation } from "@/features/location/locationSlice";
import { showToast } from "@/utills/toasterContext";

const LocationListTable = () => {
  const dispatch = useAppDispatch();
  const { locationList, loading } = useAppSelector((state) => state.location);
  const [moduleName, setModuleName] = useState(""); // State for module name
  const [moduleDescription, setModuleDescription] = useState(""); // State for module description
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // State for selected locations
  const [error, setError] = useState<string | null>(null); // State for error message

  // Handle checkbox selection
  const handleLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    locationId: string
  ) => {
    if (event.target.checked) {
      setSelectedLocations((prev) => [...prev, locationId]);
    } else {
      setSelectedLocations((prev) => prev.filter((id) => id !== locationId));
    }
  };

  // Handle form submission and format data
  const handleSubmit = () => {
    if (!moduleName) {
      setError("Module name is required.");
      return;
    }

    if (selectedLocations.length === 0) {
      setError("At least one location must be selected.");
      return;
    }

    setError(null); // Clear any previous error

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

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Page Title
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Provide the page title OR hint where implementing the location
      </Typography>

      {/* Input Fields */}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Module Name"
            fullWidth
            variant="outlined"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            error={!!error} // Show error if module name is empty
            helperText={error && !moduleName ? error : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Module Description"
            fullWidth
            variant="outlined"
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Location List Section */}
      <Typography variant="h6" gutterBottom>
        Location(s)
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        List of existing locations
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid
          container
          spacing={2}
          className="max-h-[300px] overflow-y-auto sm:max-h-[200px] md:max-h-[250px]"
        >
          {locationList?.map((location) => (
            <Grid item xs={12} sm={4} key={location.code}>
              <FormControlLabel
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
            </Grid>
          ))}
        </Grid>
      )}

      {/* Error Message for Locations */}
      {selectedLocations.length === 0 && !loading && error && (
        <FormHelperText error>{error}</FormHelperText>
      )}

      {/* Submit Button */}
      <Grid container justifyContent="flex-end" style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="success"
          style={{ borderRadius: "20px", padding: "10px 20px" }}
          onClick={handleSubmit}
        >
          Submit & Save
        </Button>
      </Grid>
    </div>
  );
};

export default LocationListTable;
