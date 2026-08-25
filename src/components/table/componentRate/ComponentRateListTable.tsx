import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { IconButton, MenuItem, Select, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import {
  getComponentRateList,
  updateComponentRate,
} from "@/features/componentRate/componentRateSlice";
import {
  ComponentRateItem,
  departmentOptions,
} from "@/features/componentRate/componentRateType";
import { Icons } from "@/components/icons/icons";

type FieldChangeHandler = (
  componentKey: string,
  field: "rate" | "department",
  value: string,
) => void;

type CellRendererParams = {
  data: ComponentRateItem;
  context: { onFieldChange: FieldChangeHandler };
};

const RATE_PATTERN = /^\d*\.?\d{0,2}$/;

const fieldSx = {
  "& .MuiInputBase-input": { fontSize: "13px", padding: "2px 0" },
};

const RateCellRenderer: React.FC<CellRendererParams> = ({ data, context }) => (
  <TextField
    value={data.rate ?? ""}
    onChange={(e) => {
      const value = e.target.value;
      if (RATE_PATTERN.test(value)) {
        context.onFieldChange(data.component_key, "rate", value);
      }
    }}
    variant="standard"
    size="small"
    fullWidth
    sx={fieldSx}
    onKeyDown={(e) => e.stopPropagation()}
  />
);

const menuItemSx = { fontSize: "13px" };

const selectSx = {
  fontSize: "13px",
  "& .MuiSelect-select": { padding: "2px 24px 2px 0" },
};

const DepartmentCellRenderer: React.FC<CellRendererParams> = ({
  data,
  context,
}) => (
  <Select
    value={data.department ?? ""}
    onChange={(e) =>
      context.onFieldChange(
        data.component_key,
        "department",
        e.target.value as string,
      )
    }
    variant="standard"
    size="small"
    fullWidth
    displayEmpty
    sx={selectSx}
    onKeyDown={(e) => e.stopPropagation()}
  >
    {departmentOptions.map((option) => (
      <MenuItem key={option.id} value={option.id} sx={menuItemSx}>
        {option.text}
      </MenuItem>
    ))}
  </Select>
);

const ComponentRateListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    componentRateList,
    componentRateListLoading,
    updateComponentRateLoading,
  } = useAppSelector((state) => state.componentRate);

  const [rowData, setRowData] = useState<ComponentRateItem[]>([]);

  useEffect(() => {
    dispatch(getComponentRateList());
  }, []);

  useEffect(() => {
    setRowData(Array.isArray(componentRateList) ? componentRateList : []);
  }, [componentRateList]);

  const handleFieldChange = useCallback<FieldChangeHandler>(
    (componentKey, field, value) => {
      setRowData((prev) =>
        prev.map((row) =>
          row.component_key === componentKey ? { ...row, [field]: value } : row,
        ),
      );
    },
    [],
  );

  const handleSave = useCallback(
    (item: ComponentRateItem) => {
      const current =
        rowData.find((row) => row.component_key === item.component_key) ?? item;
      const payload = {
        key: current.component_key,
        rate: current.rate,
        department: current.department,
      };
      dispatch(updateComponentRate({ payload })).then((res: any) => {
        if (res.payload?.data?.success) {
          dispatch(getComponentRateList());
        }
      });
    },
    [dispatch, rowData],
  );

  const columns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        colId: "srNo",
        width: 90,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) => (params.node?.rowIndex ?? 0) + 1,
      },
      { headerName: "Component Name", field: "c_name", flex: 1, filter: true },
      { headerName: "Part Code", field: "c_part_no", flex: 1, filter: true },
      {
        headerName: "Rate",
        field: "rate",
        flex: 1,
        cellRenderer: RateCellRenderer,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Department",
        field: "department",
        flex: 1,
        cellRenderer: DepartmentCellRenderer,
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: "Action",
        field: "action",
        width: 110,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) =>
          params.data ? (
            <div className="flex items-center h-full">
              <IconButton
                size="small"
                onClick={() => handleSave(params.data)}
                disabled={updateComponentRateLoading}
              >
                <Icons.save fontSize="small" />
              </IconButton>
            </div>
          ) : null,
      },
    ],
    [handleSave, updateComponentRateLoading],
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="h-[calc(100vh-80px)] p-[16px] bg-muted/30">
      <div className="h-full ag-theme-quartz grid-card border border-border rounded-lg shadow-sm overflow-hidden">
        <AgGridReact
          loading={componentRateListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData ?? []}
          columnDefs={columns}
          context={{ onFieldChange: handleFieldChange }}
          getRowId={(params) => String(params.data.component_key)}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default ComponentRateListTable;
