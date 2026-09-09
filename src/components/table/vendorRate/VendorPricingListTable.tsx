import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { getVendorPricingList, updateVendorPricing } from "@/features/vendorRate/vendorRateSlice";
import { VendorPricingListItem } from "@/features/vendorRate/vendorRateType";
import { Icons } from "@/components/icons/icons";

type RowData = {
  pricing_key: string;
  vendor_id: string;
  vendor_name: string;
  component_key: string;
  part_code: string;
  component_name: string;
  rate: number | "";
  currency: string;
  insert_date: string;
  inserted_by: string;
  _dirty?: boolean;
};

type FieldChangeHandler = (pricingKey: string, field: "rate", value: string) => void;

type CellRendererParams = {
  data: RowData;
  context: { onFieldChange: FieldChangeHandler };
};

const RATE_PATTERN = /^\d*\.?\d{0,2}$/;

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: "13px", padding: "2px 0" },
};

const dirtyFieldSx = {
  "& .MuiInputBase-input": { fontSize: "13px", padding: "2px 0" },
  "& .MuiInputBase-root": { backgroundColor: "#fffbeb" },
};

const RateCellRenderer: React.FC<CellRendererParams> = ({ data, context }) => (
  <TextField
    value={data.rate ?? ""}
    onChange={(e) => {
      const value = e.target.value;
      if (RATE_PATTERN.test(value)) {
        context.onFieldChange(data.pricing_key, "rate", value);
      }
    }}
    variant="standard"
    size="small"
    fullWidth
    sx={data._dirty ? dirtyFieldSx : fieldSx}
    onKeyDown={(e) => e.stopPropagation()}
  />
);

const NameWithSubCellRenderer: React.FC<{ primary: string; secondary: string }> = ({ primary, secondary }) => (
  <div className="flex flex-col justify-center leading-tight py-1">
    <Typography fontSize={13} fontWeight={500}>
      {primary}
    </Typography>
    <Typography fontSize={11} sx={{ color: "text.secondary" }}>
      {secondary}
    </Typography>
  </div>
);

const toRow = (item: VendorPricingListItem): RowData => ({
  pricing_key: item.pricing_key,
  vendor_id: item.vendor?.vendor_id,
  vendor_name: item.vendor?.vendor_name,
  component_key: item.component?.component_key,
  part_code: item.component?.part_code,
  component_name: item.component?.component_name,
  rate: Number(item.rate),
  currency: item.currency,
  insert_date: item.insert_date,
  inserted_by: item.inserted_by,
});

const VendorPricingListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vendorPricingList, vendorPricingListLoading, updateVendorPricingLoading } = useAppSelector((state) => state.vendorRate);

  const [rowData, setRowData] = useState<RowData[]>([]);
  const originalRatesRef = useRef<any>({});

  useEffect(() => {
    dispatch(getVendorPricingList());
  }, []);

  useEffect(() => {
    const rows = Array.isArray(vendorPricingList) ? vendorPricingList.map(toRow) : [];
    originalRatesRef.current = Object.fromEntries(rows.map((row) => [row.pricing_key, row.rate]));
    setRowData(rows);
  }, [vendorPricingList]);

  const handleFieldChange = useCallback<FieldChangeHandler>((pricingKey, field, value) => {
    setRowData((prev) => prev.map((row) => (row.pricing_key === pricingKey ? { ...row, [field]: value === "" ? "" : Number(value) } : row)));
  }, []);

  const rowsWithDirtyFlag = useMemo(
    () => rowData.map((row) => ({ ...row, _dirty: Number(row.rate) !== originalRatesRef.current[row.pricing_key] })),
    [rowData],
  );

  const dirtyRows = useMemo(() => rowsWithDirtyFlag.filter((row) => row._dirty), [rowsWithDirtyFlag]);

  const handleDiscard = useCallback(() => {
    const rows = Array.isArray(vendorPricingList) ? vendorPricingList.map(toRow) : [];
    setRowData(rows);
  }, [vendorPricingList]);

  const handleSave = useCallback(
    (row: RowData) => {
      const current = rowData.find((r) => r.pricing_key === row.pricing_key) ?? row;
      const rateNum = Number(current.rate);
      if (current.rate === "" || Number.isNaN(rateNum) || rateNum <= 0) return;

      dispatch(updateVendorPricing([{ pricing_key: current.pricing_key, rate: rateNum }])).then((res: any) => {
        if (res.payload?.data?.success) {
          dispatch(getVendorPricingList());
        }
      });
    },
    [dispatch, rowData],
  );

  const handleBulkUpdate = useCallback(() => {
    const payload = dirtyRows
      .filter((row) => row.rate !== "" && !Number.isNaN(Number(row.rate)) && Number(row.rate) > 0)
      .map((row) => ({ pricing_key: row.pricing_key, rate: Number(row.rate) }));
    if (!payload.length) return;

    dispatch(updateVendorPricing(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        dispatch(getVendorPricingList());
      }
    });
  }, [dispatch, dirtyRows]);

  const columns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        colId: "srNo",
        width: 70,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) => (params.node?.rowIndex ?? 0) + 1,
      },
      {
        headerName: "Vendor",
        field: "vendor_name",
        flex: 1.2,
        filter: "agTextColumnFilter",
        filterValueGetter: (params: any) => `${params.data?.vendor_name ?? ""} ${params.data?.vendor_id ?? ""}`,
        getQuickFilterText: (params: any) => `${params.data?.vendor_name ?? ""} ${params.data?.vendor_id ?? ""}`,
        cellRenderer: (params: any) => (params.data ? <NameWithSubCellRenderer primary={params.data.vendor_name} secondary={params.data.vendor_id} /> : null),
      },
      {
        headerName: "Component",
        field: "component_name",
        flex: 1.4,
        filter: "agTextColumnFilter",
        filterValueGetter: (params: any) => `${params.data?.component_name ?? ""} ${params.data?.part_code ?? ""}`,
        getQuickFilterText: (params: any) => `${params.data?.component_name ?? ""} ${params.data?.part_code ?? ""}`,
        cellRenderer: (params: any) => (params.data ? <NameWithSubCellRenderer primary={params.data.component_name} secondary={params.data.part_code} /> : null),
      },
      {
        headerName: "Rate",
        field: "rate",
        flex: 0.8,
        cellRenderer: RateCellRenderer,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      { headerName: "Currency", field: "currency", flex: 0.7 },
      { headerName: "Inserted Date", field: "insert_date", flex: 1 },
      { headerName: "Inserted By", field: "inserted_by", flex: 0.9 },
      {
        headerName: "Action",
        field: "action",
        width: 110,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) =>
          params.data ? (
            <div className="flex items-center h-full">

              <IconButton size="small" color="error" disabled title="Delete endpoint not configured yet">
                <Icons.delete fontSize="small" />
              </IconButton>
            </div>
          ) : null,
      },
    ],
    [handleSave, updateVendorPricingLoading],
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="h-[calc(100vh-80px)] p-[16px] bg-muted/30 flex flex-col gap-[10px]">
      <div className="flex items-center justify-between shrink-0">
    <div />
        <div className="flex items-center gap-[10px]">
          {dirtyRows.length > 0 && (
            <>
              <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 600 }}>
                {dirtyRows.length} unsaved change{dirtyRows.length === 1 ? "" : "s"}
              </Typography>
              <Button size="small" variant="outlined" color="inherit" onClick={handleDiscard} disabled={updateVendorPricingLoading}>
                Discard
              </Button>
            </>
          )}
          <LoadingButton
            size="small"
            variant="contained"
            startIcon={<Icons.save fontSize="small" />}
            loading={updateVendorPricingLoading}
            disabled={dirtyRows.length === 0}
            onClick={handleBulkUpdate}
            disableElevation
          >
            Update Rates{dirtyRows.length ? ` (${dirtyRows.length})` : ""}
          </LoadingButton>
        </div>
      </div>

      <div className="flex-1 min-h-0 ag-theme-quartz grid-card border border-border rounded-lg shadow-sm overflow-hidden">
        <AgGridReact
          loading={vendorPricingListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowsWithDirtyFlag}
          columnDefs={columns}
          context={{ onFieldChange: handleFieldChange }}
          getRowId={(params) => String(params.data.pricing_key)}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default VendorPricingListTable;
