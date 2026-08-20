import { SxProps, Theme } from "@mui/material";

export const entriesGridSx: SxProps<Theme> = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "10px",
  backgroundColor: "background.paper",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    fontSize: "12.5px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "text.secondary",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    fontSize: "13.5px",
    borderColor: "#f4f4f5",
  },
  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f4f4f5",
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#fafafa",
  },
  "& .MuiDataGrid-row:nth-of-type(even):hover": {
    backgroundColor: "#f0f0f1",
  },
};
