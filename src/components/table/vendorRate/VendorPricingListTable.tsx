import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import {
  getVendorPricingList,
  updateVendorPricing,
} from "@/features/vendorRate/vendorRateSlice";
import { VendorPricingListItem } from "@/features/vendorRate/vendorRateType";
import { Icons } from "@/components/icons/icons";
import { leftAlignedColumn } from "@/utills/agGridAlignUtils";

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
  _rowId: string;
  _originalRate: number | "";
  _dirty?: boolean;
};

type FieldChangeHandler = (rowId: string, field: "rate", value: string) => void;

type CellRendererParams = {
  data: RowData;
  context: { onFieldChange: FieldChangeHandler };
};

const RATE_PATTERN = /^\d*\.?\d{0,2}$/;
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_PAGE_SIZE = 50;

const defaultColDef: ColDef = {
  wrapText: true,
  autoHeight: true,
  cellStyle: {
    lineHeight: "1.4",
    paddingTop: "8px",
    paddingBottom: "8px",
    display: "flex",
    alignItems: "center",
  },
};

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
        context.onFieldChange(data._rowId, "rate", value);
      }
    }}
    variant="standard"
    size="small"
    fullWidth
    sx={data._dirty ? dirtyFieldSx : fieldSx}
    onKeyDown={(e) => e.stopPropagation()}
  />
);

const NameWithSubCellRenderer: React.FC<{
  primary: string;
  secondary: string;
}> = ({ primary, secondary }) => (
  <div className="flex flex-col justify-center leading-tight py-1">
    <Typography fontSize={13} fontWeight={500}>
      {primary}
    </Typography>
    <Typography fontSize={11} sx={{ color: "text.secondary" }}>
      {secondary}
    </Typography>
  </div>
);

// null/undefined/invalid rates become "" so they never compare as changed (NaN !== NaN)
const normalizeRate = (value: unknown): number | "" => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  return Number.isNaN(num) ? "" : num;
};

// _rowId is index-based because pricing_key is not guaranteed unique in the API response
const toRow = (item: VendorPricingListItem, index: number): RowData => ({
  _rowId: `${item.pricing_key}-${index}`,
  _originalRate: normalizeRate(item.rate),
  pricing_key: item.pricing_key,
  vendor_id: item.vendor?.vendor_id,
  vendor_name: item.vendor?.vendor_name,
  component_key: item.component?.component_key,
  part_code: item.component?.part_code,
  component_name: item.component?.component_name,
  rate: normalizeRate(item.rate),
  currency: item.currency,
  insert_date: item.insert_date,
  inserted_by: item.inserted_by,
});

const VendorPricingListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    vendorPricingList,
    vendorPricingPagination,
    vendorPricingListLoading,
    updateVendorPricingLoading,
  } = useAppSelector((state) => state.vendorRate);

  const [rowData, setRowData] = useState<RowData[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

  const total = vendorPricingPagination?.total ?? 0;
  const totalPages = Math.max(
    1,
    vendorPricingPagination?.totalPages ?? Math.ceil(total / limit),
  );

  const fetchList = useCallback(() => {
    dispatch(getVendorPricingList({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setRowData(
      Array.isArray(vendorPricingList) ? vendorPricingList.map(toRow) : [],
    );
  }, [vendorPricingList]);

  const handleFieldChange = useCallback<FieldChangeHandler>(
    (rowId, field, value) => {
      setRowData((prev) =>
        prev.map((row) =>
          row._rowId === rowId
            ? { ...row, [field]: normalizeRate(value) }
            : row,
        ),
      );
    },
    [],
  );

  const rowsWithDirtyFlag = useMemo(
    () =>
      rowData.map((row) => ({
        ...row,
        _dirty: row.rate !== row._originalRate,
      })),
    [rowData],
  );

  const dirtyRows = useMemo(
    () => rowsWithDirtyFlag.filter((row) => row._dirty),
    [rowsWithDirtyFlag],
  );

  const handleDiscard = useCallback(() => {
    setRowData((prev) =>
      prev.map((row) => ({ ...row, rate: row._originalRate })),
    );
  }, []);

  const handleSave = useCallback(
    (row: RowData) => {
      const current = rowData.find((r) => r._rowId === row._rowId) ?? row;
      const rateNum = Number(current.rate);
      if (current.rate === "" || Number.isNaN(rateNum) || rateNum <= 0) return;

      dispatch(
        updateVendorPricing([
          { pricing_key: current.pricing_key, rate: rateNum },
        ]),
      ).then((res: any) => {
        if (res.payload?.data?.success) {
          fetchList();
        }
      });
    },
    [dispatch, rowData, fetchList],
  );

  const handleBulkUpdate = useCallback(() => {
    // dedupe by pricing_key so duplicate API rows don't send the same key twice
    const byKey = new Map<string, number>();
    dirtyRows
      .filter((row) => row.rate !== "" && Number(row.rate) > 0)
      .forEach((row) => byKey.set(row.pricing_key, Number(row.rate)));
    const payload = Array.from(byKey, ([pricing_key, rate]) => ({
      pricing_key,
      rate,
    }));
    if (!payload.length) return;

    dispatch(updateVendorPricing(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        fetchList();
      }
    });
  }, [dispatch, dirtyRows, fetchList]);

  const confirmDiscardIfDirty = () =>
    dirtyRows.length === 0 ||
    window.confirm("You have unsaved rate changes on this page. Discard them?");

  const handlePageChange = (value: number) => {
    if (value === page || !confirmDiscardIfDirty()) return;
    setPage(value);
  };

  const handleLimitChange = (value: number) => {
    if (value === limit || !confirmDiscardIfDirty()) return;
    setLimit(value);
    setPage(1);
  };

  const columns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        colId: "srNo",
        width: 50,
        sortable: false,
        filterable: false,
        ...leftAlignedColumn,
        cellRenderer: (params: any) =>
          (page - 1) * limit + (params.node?.rowIndex ?? 0) + 1,
      },
      {
        headerName: "Vendor",
        field: "vendor_name",
        flex: 1.2,
        warpText: true,
        ...leftAlignedColumn,
        getQuickFilterText: (params: any) =>
          `${params.data?.vendor_name ?? ""} ${params.data?.vendor_id ?? ""}`,
        cellRenderer: (params: any) =>
          params.data ? (
            <NameWithSubCellRenderer
              primary={params.data.vendor_name}
              secondary={params.data.vendor_id}
            />
          ) : null,
      },
      {
        headerName: "Part Code",
        field: "part_code",
        flex: 0.8,
        ...leftAlignedColumn,
        
      },
      {
        headerName: "Component",
        field: "component_name",
        flex: 1.4,
        ...leftAlignedColumn,
        warpText: true,
      },

      { headerName: "Currency", field: "currency", flex: 0.7, ...leftAlignedColumn },
      { headerName: "Inserted At", field: "insert_date", flex: 1 },
      { headerName: "Inserted By", field: "inserted_by", flex: 0.9 },
      {
        headerName: "Rate",
        field: "rate",
        flex: 0.8,
        cellRenderer: RateCellRenderer,
        getQuickFilterText: () => "",
        ...leftAlignedColumn,
      },
      {
        headerName: "Action",
        field: "action",
        width: 110,
        sortable: false,
        filterable: false,
        ...leftAlignedColumn,
        cellRenderer: (params: any) =>
          params.data ? (
            <div className="flex items-center h-full">
              <IconButton
                size="small"
                color="error"
                disabled
                title="Delete endpoint not configured yet"
              >
                <Icons.delete fontSize="small" />
              </IconButton>
            </div>
          ) : null,
      },
    ],
    [handleSave, updateVendorPricingLoading, page, limit],
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="h-[calc(100vh-80px)] p-[16px] bg-muted/30 flex flex-col gap-[10px]">
      <div className="flex flex-wrap items-center justify-between gap-[10px] shrink-0">
        <TextField
          size="small"
          placeholder="Search vendor, part code, component…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 340 },
            backgroundColor: "background.paper",
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icons.search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <Icons.close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <div className="flex items-center gap-[10px]">
          {dirtyRows.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ color: "warning.main", fontWeight: 600 }}
              >
                {dirtyRows.length} unsaved change
                {dirtyRows.length === 1 ? "" : "s"}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={handleDiscard}
                disabled={updateVendorPricingLoading}
              >
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

      <div
        className="flex-1 min-h-0 ag-theme-quartz grid-card border border-border rounded-lg shadow-sm overflow-hidden"
       
      >
        <AgGridReact
          loading={vendorPricingListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowsWithDirtyFlag}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          quickFilterText={search}
          context={{ onFieldChange: handleFieldChange }}
          getRowId={(params) => params.data._rowId}
          pagination={false}
          onGridReady={onGridReady}
        />
      </div>

      <div className="shrink-0 flex flex-wrap items-center justify-between gap-[10px] px-[4px]">
        <div className="flex items-center gap-[10px]">
          <span className="text-sm text-slate-600">Rows per page</span>
          <Select
            size="small"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            disabled={vendorPricingListLoading}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
          <span className="text-sm text-slate-600">
            {total
              ? `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`
              : "0 records"}
          </span>
        </div>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, value) => handlePageChange(value)}
          color="primary"
          disabled={vendorPricingListLoading}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default VendorPricingListTable;
