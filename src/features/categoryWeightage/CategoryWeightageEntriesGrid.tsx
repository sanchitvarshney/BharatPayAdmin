import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ComponentType } from "@/components/reusable/SelectComponent";

type EntryRow = {
  id: string;
  index: number;
  component: ComponentType | null;
  percentage: number;
  status: string;
};

type Props = {
  h?: number | string;
  columns: GridColDef[];
  data: any;
  onUpdate: (
    index: number,
    value: {
      component: ComponentType | null;
      percentage: number;
      status: string;
    },
  ) => void;
};

// Reusable entries table (Component / Percentage / Status) for the category weightage create/edit flows
const CategoryWeightageEntriesGrid: React.FC<Props> = ({
  data,
  h = 300,
  onUpdate,
  columns,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div style={{ height: h, width: "calc(100% - 5px)" }}>
        <DataGrid
          rows={data || []}
          columns={columns}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
          getRowHeight={() => 50}
          processRowUpdate={(newRow: EntryRow) => {
            onUpdate(newRow.index, {
              component: newRow.component,
              percentage: Number(newRow.percentage) || 0,
              status: newRow.status,
            });
            return newRow;
          }}
          onProcessRowUpdateError={(error) => console.error(error)}
        />
      </div>
    </div>
  );
};

export default CategoryWeightageEntriesGrid;
