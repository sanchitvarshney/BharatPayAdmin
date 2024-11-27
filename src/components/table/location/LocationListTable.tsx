import { Grid, Typography, TextField, Checkbox, FormControlLabel, Button, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/hooks/useReduxHook";

const LocationListTable = () => {
  const { locationList, loading } = useAppSelector((state) => state.location);
console.log(locationList)
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
          <TextField label="Location Page Hint" fullWidth variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Location Page Description" fullWidth variant="outlined" />
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
        <Grid container spacing={2} className="max-h-[300px] overflow-y-auto sm:max-h-[200px] md:max-h-[250px]">
          {locationList?.map((location, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <FormControlLabel
                control={<Checkbox />}
                label={location.name || "Unnamed Location"}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Submit Button */}
      <Grid container justifyContent="flex-end" style={{ marginTop: "20px" }}>
        <Button variant="contained" color="success" style={{ borderRadius: "20px", padding: "10px 20px" }}>
          Submit & Save
        </Button>
      </Grid>
    </div>
  );
};

export default LocationListTable;
