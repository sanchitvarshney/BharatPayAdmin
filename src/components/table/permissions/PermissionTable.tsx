import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import {useAppSelector } from "@/hooks/useReduxHook";
import { Button, IconButton, Tooltip } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Checkbox } from "antd";
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
}

// Utility function to flatten hierarchical data
const flattenMenuHierarchy = (
  data: MenuData[],
  parentHierarchy: string[] = []
): RowData[] => {
  let result: RowData[] = [];

  data.forEach((item:any) => {
    const currentHierarchy = [...parentHierarchy, item.name];
    result.push({
      orgHierarchy: currentHierarchy,
      name: item.name,
      url: item.url,
      status: item.is_active === 1 ? "ACTIVE" : "INACTIVE",
      menu_key: item.menu_key,
      can_edit: item.can_edit == 1 ? true : false,
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

// Example component for Tree Data Table with Menu Data
const TreeDataMenu: React.FC<Props> = ({ updateRow }) => { 
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>();
  // const [isId, setIsId] = useState(selectedVal);
  // const [isId, setIsID] = useState(selectedVal);
  // const isId = useSelector((state: RootState) => state.isId.isId);
  const { menuList, menuListLoading } =
    useAppSelector((state) => state.menu);
  const [columnDefs] = useState<ColDef[]>([
    { field: "name", headerName: "Menu Name", filter: true },
    { field: "url", headerName: "URL" },
    { field: "minuKey", headerName: "Menu Key", hide: true },

    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => {
        const [menuid] = useState("");
        const [isedit, setIsEdit] = useState(params.data?.can_edit);
        const [isView, setIsView] = useState(params.data?.can_view);
        const [isDelete, setIsDelete] = useState(params.data?.can_delete);

        const { deleteMenuLoading } = useAppSelector((state) => state.menu);
        return menuid === params.data?.menu_key &&
          // params.data?.can_view &&

          deleteMenuLoading ? (
          <IconButton aria-label="delete" size="small">
            <ReloadIcon className="animate-spin" fontSize="small" />
          </IconButton>
        ) : params.data?.url ? (
          <>
            <Tooltip title="View">
              <>
                <Checkbox
                  className="m-[5px]"
                  onChange={(e) => {
                    setIsView(e.target.checked); // Update `isView` on checkbox change
                  }}
                  checked={isView} // Checkbox is controlled by `isView`
                />
              </>
            </Tooltip>
            <Tooltip title="Edit">
              <>
                <Checkbox
                  className="m-[5px]"
                  onChange={(e) => {
                    setIsEdit(e.target.checked);
                  }}
                  checked={isedit}
                  // defaultChecked={params.data?.can_edit}
                />
              </>
            </Tooltip>
            <Tooltip title="Delete">
              <>
                <Checkbox
                  className="m-[5px]"
                  onChange={(e) => {
                    setIsDelete(e.target.checked);
                  }}
                  checked={isDelete}
                  // defaultChecked={params.data?.can_delete}
                />
              </>
            </Tooltip>
            <Button
              onClick={() => {
                updateRow(params, isView, isedit, isDelete);
              }}
            >
              Update
            </Button>
          </>
        ) : (
          <></>
        );
      },

      sortable: false,
      filter: false,
      maxWidth: 290,
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
      minWidth: 300,
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
    menuList&&setRowData(flattenMenuHierarchy(menuList));
  }, [menuList]);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-200px)]">
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
