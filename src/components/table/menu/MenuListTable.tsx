import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Switch } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteMenu,
  getMenuList,
  menustatusChange,
} from "@/features/menu/menuSlice";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Edit2Icon, Plus } from "lucide-react";
import CreateMenu from "./CreateMenu";
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
  project_name:string
}
type Props = {
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
};

interface RowData {
  orgHierarchy: string[];
  order: any;
  url: string | null;
  status: React.ReactNode;
  action?: React.ReactNode;
  menu_key?: string;
  name: string;
  description: string;
  icon: string | null;
  project_name:string
}

// Utility function to flatten hierarchical data
const flattenMenuHierarchy = (
  data: MenuData[],
  parentHierarchy: string[] = []
): RowData[] => {
  let result: RowData[] = [];

  data.forEach((item) => {
    const currentHierarchy = [...parentHierarchy, item.name];
    result.push({
      orgHierarchy: currentHierarchy,
      order: item.order,
      url: item.url,
      status: item.is_active === 1 ? "ACTIVE" : "INACTIVE",
      menu_key: item.menu_key,
      name: item.name,
      description: item.description,
      icon: item.icon,
      project_name:item.project_name
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
const TreeDataMenu: React.FC<Props> = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { menuList, menuListLoading } = useAppSelector(
    (state) => state.menu
  );
  const handleOpenmodal = () => setOpen(true);
  const handleClosemodal = () => setOpen(false);
  const [edit , setEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [menuId,setMenuId] = useState("");
  const dispatch = useAppDispatch();
  const [columnDefs] = useState<ColDef[]>([
    { field: "order", headerName: "Order", filter: true },
    { field: "url", headerName: "URL" },
    { field: "minuKey", headerName: "Menu Key", hide: true },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,

      cellRenderer: (params: any) => {
        const [active, setActive] = useState(params.value === "ACTIVE" ? 1 : 0);
        return (
          <div>
            <Switch
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setActive(event.target.checked ? 1 : 0);
                dispatch(
                  menustatusChange({
                    id: params.data?.menu_key || "",
                    statue: event.target.checked ? 1 : 0,
                  })
                );
              }}
              checked={active === 1}
              className="data-[state=checked]:bg-cyan-700"
            />
          </div>
        );
      },
      maxWidth: 200,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: any) => {
        const [menuid, setMenuid] = useState("");
        const { deleteMenuLoading } = useAppSelector((state) => state.menu);
        return menuid === params.data?.menu_key && deleteMenuLoading ? (
          <IconButton aria-label="delete" size="small">
            <ReloadIcon className="animate-spin" fontSize="small" />
          </IconButton>
        ) : (
          <>
            <IconButton
              onClick={() => {
                setMenuid(params.data?.menu_key || "");
                dispatch(deleteMenu(params.data?.menu_key || "")).then(
                  (res: any) => {
                    if (res?.payload?.data?.success) {
                      dispatch(getMenuList());
                      setMenuid("");
                    }
                  }
                );
              }}
              aria-label="delete"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton
              // onClick={() => {
              //   setMenuid(params.data?.menu_key || "");
              //   dispatch(deleteMenu(params.data?.menu_key || "")).then(
              //     (res: any) => {
              //       if (res?.payload?.data?.success) {
              //         dispatch(getMenuList());
              //         setMenuid("");
              //       }
              //     }
              //   );
              // }}
              onClick={() => {
                // dispatch(setMenuData(params.data));
                handleOpenmodal();
                setSelectedRow(params.data);
              }}
              aria-label="delete"
              size="small"
            >
              <Plus className="onclick-animate-spin" fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => {
                setMenuid(params.data?.menu_key || "");
                setEditData(params.data);
                setEdit(true);
                setMenuId(params.data?.menu_key || "");
                console.log(params.data);
              }}
              aria-label="delete"
              size="small"
            >
              <Edit2Icon fontSize="small" />
            </IconButton>
          </>
        );
      },

      sortable: false,
      filter: false,
      maxWidth: 150,
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
    setRowData(flattenMenuHierarchy(menuList || []));
  }, [menuList]);

  return (
    <div className="ag-theme-quartz h-[calc(100vh-110px)]">
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
      {open == true && (
        <CreateMenu open={handleOpenmodal} onClose={handleClosemodal} selectedRow={selectedRow} />
      )}
      <CreateMenu open={edit} onClose={() => setEdit(false)} selectedRow={selectedRow} data = {editData} menuId={menuId}/>
    </div>
  );
};

export default TreeDataMenu;
