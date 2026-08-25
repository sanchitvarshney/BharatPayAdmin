import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import {
  deleteBharatpeCredit,
  getBharatpeCreditList,
} from "@/features/bharatpeCredit/bharatpeCreditSlice";
import { BharatpeCreditListItem } from "@/features/bharatpeCredit/bharatpeCreditType";
import { Icons } from "@/components/icons/icons";
import BharatpeCreditForm from "@/features/bharatpeCredit/BharatpeCreditForm";
import SharedDialog from "@/components/shared/SharedDialog";
import { showToast } from "@/utills/toasterContext";

type EditingItem = BharatpeCreditListItem;

const toFormValues = (item: EditingItem): any => ({
  show: { id: String(item.show_component_key), text: item.show_component, part_code: item.show_component },
  calculate: {
    id: String(item.calc_component_key),
    text: item.calc_component,
    part_code: item.calc_component,
  },
  type: item.type,
});

const BharatpeCreditListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bharatpeCreditList, bharatpeCreditListLoading, deleteBharatpeCreditLoading } =
    useAppSelector((state) => state.bharatpeCredit);
  const [rowData, setRowData] = useState<BharatpeCreditListItem[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getBharatpeCreditList());
  }, []);

  useEffect(() => {
    setRowData(bharatpeCreditList || []);
  }, [bharatpeCreditList]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingItem(null);
  }, []);

  const handleEditClick = useCallback((item: EditingItem) => {
    setEditingItem(item);
    setDrawerOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteKey(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteKey) return;
    dispatch(deleteBharatpeCredit({ payload: { item_id: deleteKey } })).then((res: any) => {
      if (res.payload?.data?.success) {
        setDeleteKey(null);
        dispatch(getBharatpeCreditList());
      } else {
        showToast(res.payload?.data?.message || "Failed to delete BharatPe Credit.", "error");
      }
    });
  }, [deleteKey, dispatch]);

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
      { headerName: "Show Part Name", field: "show_component", flex: 1 },
      { headerName: "Calculate Part Name", field: "calc_component", flex: 1 },
      { headerName: "Type", field: "type", flex: 1 },
      { headerName: "Created By", field: "created_by", flex: 1 },
      { headerName: "Created Date", field: "date", flex: 1 },
      {
        headerName: "Action",
        field: "action",
        width: 110,
        sortable: false,
        filterable: false,
        cellRenderer: (params: any) =>
          params.data ? (
            <div className="flex items-center h-full">
              <IconButton size="small" onClick={() => handleEditClick(params.data)}>
                <Icons.edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteKey(String(params.data.key))}
              >
                <Icons.delete fontSize="small" />
              </IconButton>
            </div>
          ) : null,
      },
    ],
    [handleEditClick],
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="h-[calc(100vh-80px)] p-[16px] bg-muted/30">
      <div className="h-full ag-theme-quartz grid-card border border-border rounded-lg shadow-sm overflow-hidden">
        <AgGridReact
          loading={bharatpeCreditListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columns}
          getRowId={(params) => String(params.data.key)}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          onGridReady={onGridReady}
        />
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <div className="min-w-[420px] max-w-[90vw] h-full flex flex-col">
          <div className="h-[50px] flex items-center justify-between px-[20px]">
            <Typography variant="h6">Edit BharatPe Credit</Typography>
            <IconButton size="small" onClick={closeDrawer}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="p-[20px] overflow-y-auto">
            {editingItem && (
              <BharatpeCreditForm
                key={editingItem.key}
                mode="edit"
                recordKey={String(editingItem.key)}
                defaultValues={toFormValues(editingItem)}
                onSuccess={() => {
                  closeDrawer();
                  dispatch(getBharatpeCreditList());
                }}
              />
            )}
          </div>
        </div>
      </Drawer>

      <SharedDialog
        open={!!deleteKey}
        loading={deleteBharatpeCreditLoading}
        title="Delete BharatPe Credit"
        content="Are you sure you want to delete this BharatPe Credit?"
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        startIcon={<Icons.delete />}
        confirmText="Continue"
        cancelText="Cancel"
        disableBackdropClose
      />
    </div>
  );
};

export default BharatpeCreditListTable;
