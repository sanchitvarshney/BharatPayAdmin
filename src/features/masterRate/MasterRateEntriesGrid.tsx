import React, { useEffect, useRef, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import { entriesGridSx } from "@/components/reusable/entriesGridSx";

type EntryRow = {
  id: string;
  index: number;
  rateId?: number;
  minRange: number;
  maxRange: number;
  rate: number;
};


export const NumericEditCell: React.FC<GridRenderEditCellParams> = (props) => {
  const { id, field, value, hasFocus } = props;
  const apiRef = useGridApiContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>(value === null || value === undefined ? "" : String(value));

  useEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [hasFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sanitized = e.target.value.replace(/[^0-9.-]/g, "");
    sanitized = sanitized[0] === "-" ? "-" + sanitized.slice(1).replace(/-/g, "") : sanitized.replace(/-/g, "");
    const firstDot = sanitized.indexOf(".");
    if (firstDot !== -1) {
      sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, "");
    }
    setText(sanitized);
    const parsed = Number(sanitized);
    const newValue = sanitized === "" || sanitized === "-" || sanitized.endsWith(".") || Number.isNaN(parsed) ? sanitized : parsed;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  const navigationKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Home", "End"];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the native "Enter submits the nearest form" behavior; DataGrid's
    // own keydown handling still sees the (non-default-prevented-for-Enter) bubble.
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey || e.metaKey || navigationKeys.includes(e.key)) return;
    const input = e.currentTarget;
    if (/^[0-9]$/.test(e.key)) return;
    if (e.key === "-") {
      if (input.selectionStart === 0 && !input.value.includes("-")) return;
      e.preventDefault();
      return;
    }
    if (e.key === ".") {
      if (!input.value.includes(".")) return;
      e.preventDefault();
      return;
    }
    e.preventDefault();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full h-full px-2 outline-none border-none bg-transparent"
    />
  );
};

type Props = {
  h?: number | string;
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
          sx={entriesGridSx}
          getRowHeight={() => 50}
          processRowUpdate={(newRow: EntryRow) => {
            onUpdate(newRow.index, {
              rateId: newRow.rateId,
              minRange: Math.max(0, Number(newRow.minRange) || 0),
              maxRange: Math.max(0, Number(newRow.maxRange) || 0),
              rate: Number(newRow.rate) || 0,
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
