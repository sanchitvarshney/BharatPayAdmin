import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import {
  ColDef,
  ICellRendererParams,
  ValueGetterParams,
} from "@ag-grid-community/core";
import {
  IconButton,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Icons } from "@/components/icons/icons";
import { updateAwbCount } from "@/features/awb/awbSlice";
import { AwbListItem } from "@/features/awb/awbType";
import { showToast } from "@/utills/toasterContext";

type Props = {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onUpdated?: () => void;
};

type UpdateCountCellProps = {
  row: AwbListItem;
  isSaving: boolean;
  onSave: (row: AwbListItem, count: number) => void;
};

const UpdateCountCell: React.FC<UpdateCountCellProps> = ({ row, isSaving, onSave }) => {
  const [value, setValue] = useState(String(row.awb_count ?? ""));

  const handleSave = () => {
    const count = Number(value);
    if (value === "" || Number.isNaN(count) || count < 0) {
      showToast("Enter a valid count", "error");
      return;
    }
    onSave(row, count);
  };

  return (
    <div className="flex items-center gap-[10px] h-full">
      <TextField
        size="small"
        variant="standard"
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (val !== "" && Number(val) < 0) return;
          setValue(val);
        }}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "+" || e.key === "e") {
            e.preventDefault();
          }
        }}
        disabled={isSaving}
        slotProps={{ htmlInput: { min: 0, step: 1 } }}
        sx={{ width: 90 }}
      />
      <IconButton size="small" color="primary" disabled={isSaving} onClick={handleSave}>
        <Icons.save fontSize="small" />
      </IconButton>
    </div>
  );
};

const AwbListTable: React.FC<Props> = ({
  page,
  limit,
  onPageChange,
  onLimitChange,
  onUpdated,
}) => {
  const dispatch = useAppDispatch();
  const { awbList, awbListLoading, total, updateCountLoading, updatingAwb } =
    useAppSelector((state) => state.awb);

  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  const handleUpdate = useCallback(
    (row: AwbListItem, count: number) => {
      dispatch(updateAwbCount({ awb_nos: row.awb_nos, updated_count: count }))
        .unwrap()
        .then((res) => {
          if (res?.data?.success) {
            onUpdated?.();
          }
        })
        .catch(() => {});
    },
    [dispatch, onUpdated]
  );

  const columns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        width: 80,
        valueGetter: (params: ValueGetterParams<AwbListItem>) =>
          (page - 1) * limit + (params.node?.rowIndex ?? 0) + 1,
      },
      { headerName: "AWB No", field: "awb_nos", flex: 1 },
      { headerName: "Partner", field: "partner", flex: 1 },
      {
        headerName: "Count",
        field: "awb_count",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<AwbListItem>) => {
          const row = params.data as AwbListItem;
          const isSaving = updateCountLoading && updatingAwb === row.awb_nos;
          return <UpdateCountCell row={row} isSaving={isSaving} onSave={handleUpdate} />;
        },
      },
      { headerName: "Last Updated", field: "insert_dt", flex: 1 },
      { headerName: "Last Updated By", field: "inserted_by", flex: 1 },
    ],
    [page, limit, updateCountLoading, updatingAwb, handleUpdate]
  );

  return (
    <>
      <div className="h-[calc(100vh-200px)] ag-theme-quartz">
        <AgGridReact
          loading={awbListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={awbList || []}
          columnDefs={columns}
          pagination={false}
        />
      </div>
      <div className="h-[50px] flex items-center justify-between px-[20px] border-t">
        <div className="flex items-center gap-[10px]">
          <span className="text-sm text-slate-600">Rows per page</span>
          <Select
            size="small"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {[10, 25, 50].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
          <span className="text-sm text-slate-600">Total: {total || 0}</span>
        </div>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
        />
      </div>
    </>
  );
};

export default AwbListTable;
