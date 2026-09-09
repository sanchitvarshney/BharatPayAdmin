import React, { useEffect, useState } from "react";
import { Autocomplete, Box, CircularProgress, TextField, Typography } from "@mui/material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";

export type VendorType = {
  id: string;
  text: string;
};

type Props = {
  onChange: (value: VendorType | null) => void;
  value: VendorType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  required?: boolean;
  varient?: "outlined" | "standard" | "filled";
  size?: "small" | "medium";
};

const SelectVendor: React.FC<Props> = ({ value, onChange, label = "", width = "100%", error, helperText, required = false, varient = "outlined", size = "medium" }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemList, setItemList] = useState<VendorType[]>([]);

  const fetchItems = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/vendor/vendorOptions/${query}`);
      setItemList(response.data.data);
    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      showToast(error?.response?.data?.message?.msg || "Failed to fetch vendors", "error");
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
      getOptionLabel={(option) => (option.id ? `(${option.id})-${option.text}` : option.text)}
      filterOptions={(options) => options}
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      onInputChange={(_, newInputValue, reason: any) => {
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
      renderOption={(props, option) => {
        const { key, ...optionProps } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
        return (
          <Box
            key={key}
            component="li"
            {...optionProps}
            sx={{
              display: "flex !important",
              flexDirection: "column",
              alignItems: "flex-start !important",
              gap: 0.25,
              py: "8px !important",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
              {option.text}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                lineHeight: 1.3,
              }}
            >
              Vendor Code: <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>{option.id}</Box>
            </Typography>
          </Box>
        );
      }}
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

export default SelectVendor;
