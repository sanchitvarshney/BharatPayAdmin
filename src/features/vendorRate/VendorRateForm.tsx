import React, { useState } from "react";
import { Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createVendorRate } from "@/features/vendorRate/vendorRateSlice";
import { Icons } from "@/components/icons/icons";
import SelectVendor, { VendorType } from "@/components/reusable/SelectVendor";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import { showToast } from "@/utills/toasterContext";

type EntryRow = {
  key: string;
  vendor: VendorType;
  component: ComponentType;
  rate: number;
};

type Props = {
  onSuccess?: () => void;
};

const RATE_PATTERN = /^\d*\.?\d{0,2}$/;

const VendorRateForm: React.FC<Props> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { createVendorRateLoading } = useAppSelector((state) => state.vendorRate);

  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [rate, setRate] = useState<string>("");
  const [rows, setRows] = useState<EntryRow[]>([]);

  const handleAdd = () => {
    if (!vendor) return showToast("Please select a vendor", "error");
    if (!component) return showToast("Please select a component", "error");
    const rateNum = Number(rate);
    if (!rate || Number.isNaN(rateNum) || rateNum <= 0) return showToast("Please enter a valid rate", "error");

    const duplicate = rows.some((row) => row.vendor.id === vendor.id && row.component.part_code === component.part_code);
    if (duplicate) return showToast("This vendor + component pair is already added", "error");

    setRows((prev) => [...prev, { key: `${vendor.id}-${component.part_code}-${Date.now()}`, vendor, component, rate: rateNum }]);
    setVendor(null);
    setComponent(null);
    setRate("");
  };

  const handleRemove = (key: string) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleReset = () => {
    setVendor(null);
    setComponent(null);
    setRate("");
    setRows([]);
  };

  const handleSubmit = () => {
    if (!rows.length) return showToast("Please add at least one entry", "error");
    const payload = rows.map((row) => ({ vendor: row.vendor.id, component: row.component.part_code, rate: row.rate }));
    dispatch(createVendorRate(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        setRows([]);
        onSuccess?.();
      }
    });
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[300px_1fr] lg:[grid-template-rows:1fr] gap-[16px] items-start">
      {/* Left: fixed-width add-entry card; right column below takes all remaining width */}
      <Paper
        variant="outlined"
        sx={{
          p: "18px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Add Entry
        </Typography>

        <SelectVendor value={vendor} onChange={setVendor} label="Vendor" varient="outlined" required />
        <SelectComponent value={component} onChange={setComponent} label="Component" varient="outlined" required />
        <TextField
          label="Rate"
          value={rate}
          onChange={(e) => {
            const value = e.target.value;
            if (RATE_PATTERN.test(value)) setRate(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          fullWidth
          variant="outlined"
          size="small"
          slotProps={{ htmlInput: { inputMode: "decimal" } }}
        />
        <Button variant="contained" startIcon={<Icons.add fontSize="small" />} onClick={handleAdd} disableElevation>
          Add to List
        </Button>
      </Paper>

      {/* Right: fills all remaining width, all added entries, submitted together */}
      <Paper
        variant="outlined"
        className="self-stretch"
        sx={{
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: { xs: "420px", lg: 0 },
        }}
      >
        <div className="flex items-center justify-between px-[18px] py-[12px] border-b border-gray-200 shrink-0">
          <Typography variant="subtitle1" fontWeight={600}>
            Entries to Submit
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {rows.length} row{rows.length === 1 ? "" : "s"}
          </Typography>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Icons.bulletList sx={{ fontSize: 40 }} />
              <Typography variant="body2">No entries added yet</Typography>
              <Typography variant="caption">Use the form on the left to add vendor rates here</Typography>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-[1]">
                <tr>
                  <th className="text-left px-[18px] py-[10px] font-semibold text-gray-600 w-[50px]">#</th>
                  <th className="text-left px-[18px] py-[10px] font-semibold text-gray-600">Vendor</th>
                  <th className="text-left px-[18px] py-[10px] font-semibold text-gray-600">Component</th>
                  <th className="text-right px-[18px] py-[10px] font-semibold text-gray-600">Rate</th>
                  <th className="w-[60px]" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.key} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-[18px] py-[10px] text-gray-500 align-top">{index + 1}</td>
                    <td className="px-[18px] py-[10px] align-top">
                      <div className="font-medium">{row.vendor.text}</div>
                      <div className="text-xs text-gray-400">{row.vendor.id}</div>
                    </td>
                    <td className="px-[18px] py-[10px] align-top">
                      <div className="font-medium">{row.component.text}</div>
                      <div className="text-xs text-gray-400">{row.component.part_code}</div>
                    </td>
                    <td className="px-[18px] py-[10px] text-right align-top font-medium">{row.rate.toFixed(2)}</td>
                    <td className="px-[18px] py-[10px] text-center align-top">
                      <IconButton size="small" color="error" onClick={() => handleRemove(row.key)} title="Remove">
                        <Icons.delete fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-end gap-[10px] px-[18px] py-[12px] border-t border-gray-200 bg-gray-50 shrink-0">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Icons.refresh fontSize="small" />}
            disabled={createVendorRateLoading || (rows.length === 0 && !vendor && !component && !rate)}
            onClick={handleReset}
          >
            Reset
          </Button>
          <LoadingButton
            variant="contained"
            startIcon={<Icons.save fontSize="small" />}
            loading={createVendorRateLoading}
            disabled={rows.length === 0}
            onClick={handleSubmit}
            disableElevation
          >
            Submit All{rows.length ? ` (${rows.length})` : ""}
          </LoadingButton>
        </div>
      </Paper>
    </div>
  );
};

export default VendorRateForm;
