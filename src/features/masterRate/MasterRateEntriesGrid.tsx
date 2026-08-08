import React, { useEffect, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from "@mui/x-data-grid";

type EntryRow = {
  id: string;
  index: number;
  rateId?: number;
  minRange: number;
  maxRange: number;
  rate: number;
};

// Shared edit-cell input for Min Range / Max Range / Rate: clamps to non-negative,
// blocks "-"/"+"/"e" keystrokes, and selects the existing value on focus.
export const NumericEditCell: React.FC<GridRenderEditCellParams> = (props) => {
  const { id, field, value, hasFocus } = props;
  const apiRef = useGridApiContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [hasFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, Number(e.target.value) || 0);
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "+", "e"].includes(e.key)) e.preventDefault();
    // Prevent the native "Enter submits the nearest form" behavior; DataGrid's
    // own keydown handling still sees the (non-default-prevented-for-Enter) bubble.
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <input
      ref={inputRef}
      type="number"
      min={0}
      value={value ?? 0}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full h-full px-2 outline-none border-none bg-transparent"
    />
  );
};

type Props = {
  h?: number;
  columns: GridColDef[];
  data: any;
  onUpdate: (
    index: number,
    value: {
      rateId?: number;
      minRange: number;
      maxRange: number;
      rate: number;
    },
  ) => void;
};

// Reusable entries table (Min Range / Max Range / Rate) shared by create and edit flows
const MasterRateEntriesGrid: React.FC<Props> = ({ data, h = 300, onUpdate, columns }) => {
  return (
    <div className="flex flex-col gap-2">
      <div style={{ height: h, width: "calc(100% - 5px)" }}>
        <DataGrid
          rows={data || []}
          columns={columns}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={() => 50}
          processRowUpdate={(newRow: EntryRow) => {
            onUpdate(newRow.index, {
              rateId: newRow.rateId,
              minRange: Math.max(0, Number(newRow.minRange)),
              maxRange: Math.max(0, Number(newRow.maxRange)),
              rate: Math.max(0, Number(newRow.rate)),
            });
            return newRow;
          }}
          onProcessRowUpdateError={(error) => console.error(error)}
        />
      </div>
    </div>
  );
};

export default MasterRateEntriesGrid;
