import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { getCategoryWeightageList } from "@/features/categoryWeightage/categoryWeightageSlice";
import { CategoryWeightageListItem } from "@/features/categoryWeightage/categoryWeightageType";
import { Icons } from "@/components/icons/icons";
import CategoryWeightageForm, {
  CategoryWeightageFormValues,
  COMPONENT_STATUS,
} from "@/features/categoryWeightage/CategoryWeightageForm";

type EditingItem = CategoryWeightageListItem;

const toFormValues = (item: EditingItem): CategoryWeightageFormValues => ({
  components: [
    {
      component: {
        id: item.component,
        text: item.part_code,
        part_code: item.part_code,
      },
      percentage: Number(item.wastage_percent) || 0,
      status: COMPONENT_STATUS.ACTIVE,
    },
  ],
});

const CategoryWeightageListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryWeightageList, categoryWeightageListLoading } = useAppSelector(
    (state) => state.categoryWeightage,
  );
  const [rowData, setRowData] = useState<CategoryWeightageListItem[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategoryWeightageList());
  }, []);

  useEffect(() => {
    setRowData(categoryWeightageList || []);
  }, [categoryWeightageList]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingItem(null);
  }, []);

  const handleEditClick = useCallback((item: EditingItem) => {
    setEditingItem(item);
    setDrawerOpen(true);
  }, []);

  const columns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        colId: "srNo",
        width: 100,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) => (params.node?.rowIndex ?? 0) + 1,
      },
      { headerName: "Part Code", field: "part_code", flex: 1 },
      { headerName: "Wastage %", field: "wastage_percent", flex: 1 },
      { headerName: "Created By", field: "created_by", flex: 1 },
      { headerName: "Created Date", field: "created_at", flex: 1 },
      { headerName: "Updated By", field: "updated_by", flex: 1 },
      { headerName: "Updated Date", field: "updated_at", flex: 1 },
      {
        headerName: "Action",
        field: "action",
        width: 90,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) =>
          params.data ? (
            <IconButton
              size="small"
              onClick={() => handleEditClick(params.data)}
            >
              <Icons.edit fontSize="small" />
            </IconButton>
          ) : null,
      },
    ],
    [handleEditClick],
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.autoSizeAllColumns();
  };

  return (
    <div className="h-[calc(100vh-80px)] ag-theme-quartz">
      <AgGridReact
        loading={categoryWeightageListLoading}
        loadingOverlayComponent={CustomLoadingOverlay}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columns}
        getRowId={(params) => String(params.data.id)}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        onGridReady={onGridReady}
      />

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <div className="min-w-[60vw] max-w-[90vw] h-full flex flex-col">
          <div className="h-[50px] flex items-center justify-between px-[20px]">
            <Typography variant="h6">Edit Component Wastage</Typography>
            <IconButton size="small" onClick={closeDrawer}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="p-[20px] overflow-y-auto">
            {editingItem && (
              <CategoryWeightageForm
                key={editingItem.id}
                mode="edit"
                categoryKey={String(editingItem.id)}
                defaultValues={toFormValues(editingItem)}
                onSuccess={() => {
                  closeDrawer();
                  dispatch(getCategoryWeightageList());
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CategoryWeightageListTable;
