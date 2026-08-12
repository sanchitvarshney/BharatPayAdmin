import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/baratpayDashApi";

export type ComponentType = {
  id: string;
  text: string;
  part_code: string;
};

type Props = {
  onChange: (value: ComponentType | null) => void;
  value: ComponentType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  required?: boolean;
  varient?: "outlined" | "standard" | "filled";
  size?: "small" | "medium";
};

const SelectComponent: React.FC<Props> = ({ value, onChange, label = "", width = "100%", error, helperText, required = false, varient = "outlined", size = "medium" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemList, setItemList] = useState<ComponentType[]>([]);

  // Fetch items based on search query
  const fetchItems = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/backend/search/item/${query}`);
      setItemList(response.data.data); // Assuming response follows the LocationApiresponse format
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchItems(debouncedInputValue);
    }
  }, [debouncedInputValue]);
  useEffect(() => {
    fetchItems(null);
  }, []);
  return (
    <Autocomplete
      onFocus={() => fetchItems(null)}
      value={value}
      size={size}
      options={itemList || []}
      getOptionLabel={(option) => (option.part_code ? `(${option.part_code})-${option.text}` : option.text)}
      filterOptions={(options) => options} 
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      onInputChange={(_, newInputValue, reason:any) => {
        (reason === "input" || reason === "clear") && setInputValue(newInputValue);
      }}
     renderInput={(params) => (
    <TextField
      {...params}
      required={required}
      error={error}
      helperText={helperText}
      label={label}
      variant={varient}
      size="small"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading && <CircularProgress size={16} />}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  renderOption={(props, option) => (
    <li {...props}>
      {option.part_code ? `(${option.part_code})-${option.text}` : option.text}
    </li>
  )}
  sx={{
    width,
    height: "40px",
    display: "flex",
    alignItems: "center",

    "& .MuiFormControl-root": {
      width: "100%",
      margin: 0,
    },

    "& .MuiInputBase-root": {
      height: "40px",
      boxSizing: "border-box",
    },
  }}
    />
  );
};

export default SelectComponent;
