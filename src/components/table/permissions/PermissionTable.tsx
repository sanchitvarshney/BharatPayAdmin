import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Button, Tooltip, Checkbox } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

// TypeScript types for hierarchical menu data and row data
interface MenuData {
  menu_key: string;
  name: string;
  url: string | null;
  is_active: number;
  description: string;
  children?: MenuData[];
  parent_menu_key: string | null;
  order: number;
  icon: string | null;
}

type Props = {
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedType: string;
  selectedVal: string;
  updateRow: any;
  user: any;
};

interface RowData {
  orgHierarchy: string[];
  name: string;
  url: string | null;
  status: React.ReactNode;
  action?: React.ReactNode;
  menu_key?: string;
  can_edit?: boolean;
  can_view?: boolean;
  can_delete?: boolean;
  can_add?: boolean;
}

// Utility function to flatten hierarchical data
const flattenMenuHierarchy = (
  data: MenuData[],
  parentHierarchy: string[] = []
): RowData[] => {
  let result: RowData[] = [];

  data.forEach((item: any) => {
    const currentHierarchy = [...parentHierarchy, item.name];
    result.push({
      orgHierarchy: currentHierarchy,
      name: item.name,
      url: item.url,
      status: item.is_active === 1 ? "ACTIVE" : "INACTIVE",
      menu_key: item.menu_key,
      can_edit: item.can_edit == 1 ? true : false,
      can_add: item.can_add == 1 ? true : false,
      can_delete: item.can_delete == 1 ? true : false,
      can_view: item.can_view == 1 ? true : false,
    });

    if (item.children && item.children.length > 0) {
      result = result.concat(
        flattenMenuHierarchy(item.children, currentHierarchy)
      );
    }
  });

  return result;
};

const CustomHeader = () => (
  <div style={{ display: "flex", gap: "45px", fontWeight: "bold" }}>
    <span>View</span>
    <span>Edit</span>
    <span>Add</span>
    <span>Delete</span>
  </div>
);
const TreeDataMenu: React.FC<Props> = ({ updateRow, selectedType, selectedVal,user }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { menuList, menuListLoading } = useAppSelector((state) => state.menu);

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "name",
      headerName: "Menu Name",
      filter: true,
      maxWidth: 300,
      minWidth: 150,
      autoHeight: true,
    },
    // { field: "url", headerName: "URL",maxWidth: 300,
    //   minWidth: 150,
    //   autoHeight: true, },
    { field: "menuKey", headerName: "Menu Key", hide: true },
    {
      headerComponent: CustomHeader,
      field: "action",
      cellRenderer: (params: any) => {
        const [isEdit, setIsEdit] = useState<boolean>(
          params.data?.can_edit || false
        );
        const [isAdd, setIsAdd] = useState<boolean>(
          params.data?.can_add || false
        );
        const [isView, setIsView] = useState<boolean>(
          params.data?.can_view || false
        );
        const [isDelete, setIsDelete] = useState<boolean>(
          params.data?.can_delete || false
        );

        if (!params.data?.url) return null;

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className="permissions-group"
              style={{ display: "flex", gap: "45px" }}
            >
              <Tooltip title="View">
                <Checkbox
                  className="permission-checkbox"
                  onChange={(e) => setIsView(e.target.checked)}
                  checked={isView}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Checkbox
                  className="permission-checkbox"
                  onChange={(e) => setIsEdit(e.target.checked)}
                  checked={isEdit}
                />
              </Tooltip>
              <Tooltip title="Add">
                <Checkbox
                  className="permission-checkbox"
                  onChange={(e) => setIsAdd(e.target.checked)}
                  checked={isAdd}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Checkbox
                  className="permission-checkbox"
                  onChange={(e) => setIsDelete(e.target.checked)}
                  checked={isDelete}
                />
              </Tooltip>
            </div>
            <Button
              onClick={() => {
                updateRow(params, isView, isEdit, isAdd, isDelete);
              }}
              variant="contained"
              color="primary"
              style={{
                marginLeft: "50px",
                visibility: params.data ? "visible" : "hidden",
              }}
            >
              Update
            </Button>
          </div>
        );
      },
      sortable: false,
      filter: false,
      maxWidth: 800,
    },
  ]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      floatingFilter: true,
      filter: "agTextColumnFilter",
    }),
    []
  );

  const autoGroupColumnDef = useMemo<ColDef>(
    () => ({
      headerName: "Menu Hierarchy",
      maxWidth: 300,
      minWidth: 200,
      autoHeight: true,
      cellRendererParams: {
        suppressCount: true,
      },
    }),
    []
  );

  const getDataPath = useCallback((data: RowData) => {
    return data.orgHierarchy;
  }, []);

  useEffect(() => {
    // Only set the rowData when menuList is not empty
    if (menuList && Array.isArray(menuList) && (user||selectedVal)&&selectedType  ) {
      setRowData(flattenMenuHierarchy(menuList));
    }
  }, [menuList, selectedType, selectedVal, user]);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-175px)]">
      <AgGridReact
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        loading={menuListLoading}
        loadingOverlayComponent={CustomLoadingOverlay}
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        treeData={true}
        groupDefaultExpanded={-1}
        suppressCellFocus={true}
        getDataPath={getDataPath}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default TreeDataMenu;
