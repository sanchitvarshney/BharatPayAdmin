import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, GridReadyEvent } from "@ag-grid-community/core";
import { Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { getMasterRateList } from "@/features/masterRate/masterRateSlice";
import { MasterRateDeviceGroup } from "@/features/masterRate/masterRateType";
import { Icons } from "@/components/icons/icons";
import MasterRateForm, {
  MasterRateFormValues,
} from "@/features/masterRate/MasterRateForm";

type RowData = {
  orgHierarchy: string[];
  rateCode: string;
  rateId: number;
  deviceCategory: string;
  productKey: string;
  productName: string;
  productSkuCode: string;
  productModelName: string | null;
  minCount: number;
  maxCount: number;
  amount: number;
  activeStatus: string;
  createdUser: string;
  createdDate: string;
  updatedUser: string;
  updatedDate: string;
};

type EditingProduct = {
  productKey: string;
  deviceCategory: string;
  productSkuCode: string;
  productName: string;
  entries: RowData[];
};

const flattenMasterRateGroups = (groups: MasterRateDeviceGroup[]): RowData[] =>
  groups.flatMap((deviceGroup) =>
    deviceGroup.products.flatMap((product) =>
      product.entries.map((entry) => ({
        orgHierarchy: [
          deviceGroup.deviceType,
          product.productSkuCode
            ? `${product.productSkuCode} - ${product.productName}`
            : product.productName,
          entry.rateCode,
        ],
        rateCode: entry.rateCode,
        rateId: entry.rateId,
        deviceCategory: deviceGroup.deviceType,
        productKey: product.productKey,
        productName: product.productName,
        productSkuCode: product.productSkuCode,
        productModelName: product.productModelName,
        minCount: entry.minCount,
        maxCount: entry.maxCount,
        amount: Number(entry.amount),
        activeStatus: entry.activeStatus,
        createdUser: entry.createdUser,
        createdDate: entry.createdDate,
        updatedUser: entry.updatedUser || "-",
        updatedDate: entry.updatedDate || "-",
      })),
    ),
  );

const toFormValues = (product: EditingProduct): MasterRateFormValues => ({
  type: product.deviceCategory,
  //@ts-ignore
  sku: product?.productKey
    ? { id: product?.productKey, text: product.productSkuCode || product.productName }
    : null,
  entries: product.entries.map((entry) => ({
    rateId: entry.rateId,
    minRange: entry.minCount,
    maxRange: entry.maxCount,
    rate: entry.amount,
  })),
});

const MasterRateListTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { masterRateList, masterRateListLoading } = useAppSelector(
    (state) => state.masterRate,
  );
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getMasterRateList());
  }, []);

  useEffect(() => {
    setRowData(flattenMasterRateGroups(masterRateList || []));
  }, [masterRateList]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingProduct(null);
  }, []);

  const handleEditClick = useCallback((node: any) => {
    const entries: RowData[] = (node.allLeafChildren || [])
      .map((leaf: any) => leaf.data)
      .filter(Boolean);
    
    if (!entries.length) return;
    const first = entries[0];
      console.log("entries", entries);
    setEditingProduct({
      productKey: first.productKey,
      deviceCategory: first.deviceCategory,
      productSkuCode: first.productSkuCode,
      productName: first.productName,
      
      entries,
    });
    setDrawerOpen(true);
  }, []);

  const columns: ColDef[] = useMemo(
    () => [
      { headerName: "Rate Code", field: "rateCode", hide: true },
      { headerName: "Device Category", field: "deviceCategory", hide: true },
      { headerName: "Product Key", field: "productKey", hide: true },
      {
        headerName: "Product SKU",
        field: "productSkuCode",
        flex: 1,
        hide: true,
      },
      { headerName: "Model", field: "productModelName", flex: 1 },
      {
        headerName: "Range",
        field: "",
        cellRenderer: (params: any) =>
          params.data
            ? `${params.data.minCount} - ${params.data.maxCount}`
            : "",
        flex: 1,
      },
      { headerName: "Amount", field: "amount", flex: 1 },
      {
        headerName: "Status",
        field: "activeStatus",
        flex: 1,
        cellRenderer: (params: any) =>
          params.data ? (
            <Typography
              variant="subtitle2"
              sx={{
                color: params.data.activeStatus === "ACTIVE" ? "green" : "red",
              }}
            >
              {params.data.activeStatus === "ACTIVE" ? "Active" : "Inactive"}
            </Typography>
          ) : (
            ""
          ),
      },
      { headerName: "Created By", field: "createdUser", flex: 1 },
      { headerName: "Created Date", field: "createdDate", flex: 1 },
      { headerName: "Updated By", field: "updatedUser", flex: 1 },
      { headerName: "Updated Date", field: "updatedDate", flex: 1 },
    ],
    [],
  );

  const autoGroupColumnDef: ColDef = useMemo(
    () => ({
      headerName: "Device Type / Product",
      minWidth: 400,
      valueGetter: (params: any) => (params.node.group ? params.node.key : undefined),
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: any) => {
          if (!params.node.group) return null;
          if (params.node.level === 1) {
            return (
              <div className="flex items-center justify-between w-full pr-[8px]">
                <span>{params.value}</span>
                <IconButton
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEditClick(params.node);
                  }}
                  sx={{ml:1}}
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
          loading={masterRateListLoading}
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
            <Typography variant="h6">Edit Master Rate</Typography>
            <IconButton size="small" onClick={closeDrawer}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="p-[20px] overflow-y-auto">
            {editingProduct && (
              <MasterRateForm
                key={editingProduct.productKey}
                mode="edit"
                productKey={editingProduct.productKey}
                defaultValues={toFormValues(editingProduct)}
                onSuccess={() => {
                  closeDrawer();
                  dispatch(getMasterRateList());
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MasterRateListTable;
