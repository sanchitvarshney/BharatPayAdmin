import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { getCategoryRateList } from "@/features/categoryRate/categoryRateSlice";
import { CategoryRateGroup } from "@/features/categoryRate/categoryRateType";
import { Icons } from "@/components/icons/icons";
import CategoryRateForm, { CategoryRateFormValues, COMPONENT_STATUS } from "@/features/categoryRate/CategoryRateForm";

type RowData = {
  orgHierarchy: string[];
  categoryId: number;
  categoryKey: string;
  categoryName: string;
  rateId: number;
  rateKey: string;
  componentKey: string;
  componentName: string;
  rate: number;
  createdDate: string;
};

type EditingCategory = {
  categoryKey: string;
  categoryName: string;
  entries: RowData[];
};

const flattenCategoryRateGroups = (groups: CategoryRateGroup[]): RowData[] =>
  groups.flatMap((category) =>
    category.components.map((component) => ({
      orgHierarchy: [category.categoryName, component.componentName],
      categoryId: category.categoryId,
      categoryKey: category.categoryKey,
      categoryName: category.categoryName,
      rateId: component.rateId,
      rateKey: component.rateKey,
      componentKey: component.componentKey,
      componentName: component.componentName,
      rate: Number(component.rate),
      createdDate: component.createdDate,
    })),
  );

const toFormValues = (category: EditingCategory): CategoryRateFormValues => ({
  categoryName: category.categoryName,
  components: category.entries.map((entry) => ({
    component: { id: entry.componentKey, text: entry.componentName, part_code: "" },
    rate: entry.rate,
    status: COMPONENT_STATUS.ACTIVE,
  })),
});

const CategoryRateListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryRateList, categoryRateListLoading } = useAppSelector((state) => state.categoryRate);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategoryRateList());
  }, []);

  useEffect(() => {
    setRowData(flattenCategoryRateGroups(categoryRateList || []));
  }, [categoryRateList]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingCategory(null);
  }, []);

  const handleEditClick = useCallback((node: any) => {
    const entries: RowData[] = (node.allLeafChildren || [])
      .map((leaf: any) => leaf.data)
      .filter(Boolean);

    if (!entries.length) return;
    const first = entries[0];
    setEditingCategory({
      categoryKey: first.categoryKey,
      categoryName: first.categoryName,
      entries,
    });
    setDrawerOpen(true);
  }, []);

  const columns: ColDef[] = useMemo(
    () => [
      { headerName: "Category Key", field: "categoryKey", hide: true },
      { headerName: "Component Key", field: "componentKey", hide: true },
      { headerName: "Rate Key", field: "rateKey", hide: true },
      { headerName: "Component Name", field: "componentName", flex: 1 },
      { headerName: "Rate", field: "rate", flex: 1 },
      { headerName: "Created Date", field: "createdDate", flex: 1 },
    ],
    [],
  );

  const autoGroupColumnDef: ColDef = useMemo(
    () => ({
      headerName: "Category / Component",
      minWidth: 400,
      valueGetter: (params: any) => (params.node.group ? params.node.key : undefined),
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: any) => {
          if (!params.node.group) return null;
          if (params.node.level === 0) {
            return (
              <div className="flex items-center justify-between w-full pr-[8px]">
                <span>{params.value}</span>
                <IconButton
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEditClick(params.node);
                  }}
                  sx={{ ml: 1 }}
                >
                  <Icons.edit fontSize="small" />
                </IconButton>
              </div>
            );
          }
          return <span>{params.value}</span>;
        },
      },
    }),
    [handleEditClick],
  );

  const getDataPath = useCallback((data: RowData) => data.orgHierarchy, []);

  const onGridReady = (params: GridReadyEvent) => {
    params.api.autoSizeAllColumns();
  };

  return (
    <div className="h-[calc(100vh-80px)] p-[16px] bg-muted/30">
      <div className="h-full ag-theme-quartz grid-card border border-border rounded-lg shadow-sm overflow-hidden">
        <AgGridReact
          loading={categoryRateListLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columns}
          treeData={true}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          onGridReady={onGridReady}
        />
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <div className="min-w-[60vw] max-w-[90vw] h-full flex flex-col">
          <div className="h-[50px] flex items-center justify-between px-[20px]">
            <Typography variant="h6">Edit Category Rate</Typography>
            <IconButton size="small" onClick={closeDrawer}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="p-[20px] overflow-y-auto">
            {editingCategory && (
              <CategoryRateForm
                key={editingCategory.categoryKey}
                mode="edit"
                categoryKey={editingCategory.categoryKey}
                defaultValues={toFormValues(editingCategory)}
                onSuccess={() => {
                  closeDrawer();
                  dispatch(getCategoryRateList());
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CategoryRateListTable;
