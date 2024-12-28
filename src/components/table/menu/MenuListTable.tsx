import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Switch } from "@mui/material";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import ViewListIcon from "@mui/icons-material/ViewList";
import { deleteMenu, getMenuList, getMenuTabList, menustatusChange } from "@/features/menu/menuSlice";
import { ReloadIcon } from "@radix-ui/react-icons";
import CreateMenu from "./CreateMenu";
import SharedDialog from "@/components/shared/SharedDialog";
import TabDetailsDialog from "@/features/menu/TabDetailsDialog";
import AddTab from "@/components/table/menu/AddTab";
import { Tooltip } from "@mui/material";
import { Icons } from "@/components/icons/icons";
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
  project_name: string;
  hasTab: boolean;
}
type Props = {
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  setMenu?: any;
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
  project_name: string;
  hasTab: boolean;
}

// Utility function to flatten hierarchical data
const flattenMenuHierarchy = (data: MenuData[], parentHierarchy: string[] = []): RowData[] => {
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
      project_name: item.project_name,
      hasTab: item.hasTab,
    });

    if (item.children && item.children.length > 0) {
      result = result.concat(flattenMenuHierarchy(item.children, currentHierarchy));
    }
  });

  return result;
};

// Example component for Tree Data Table with Menu Data
const TreeDataMenu: React.FC<Props> = ({setMenu}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [tabData, setTabData] = useState<RowData[]>([]);
  const { menuList, menuListLoading } = useAppSelector((state) => state.menu);
  const handleOpenmodal = () => setOpen(true);
  const handleClosemodal = () => setOpen(false);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [menuId, setMenuId] = useState("");
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const [showTabDialog, setShowTabDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [addTabModal, setAddTabModal] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteMenuLoading } = useAppSelector((state) => state.menu);
  const [columnDefs] = useState<ColDef[]>([
    { field: "order", headerName: "Order", filter: false },
    { field: "url", headerName: "URL" },
    { field: "minuKey", headerName: "Menu Key", hide: true },
    {
      headerName: "Status",
      field: "status",
      sortable: false,
      filter: false,

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

        return menuid === params.data?.menu_key && deleteMenuLoading ? (
          <IconButton aria-label="delete" size="small">
            <ReloadIcon className="animate-spin" fontSize="small" />
          </IconButton>
        ) : (
          <>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  setMenuid(params.data?.menu_key || "");
                  setMenuToDelete(params.data?.menu_key || "");
                  setOpenDelete(true);
                }}
                aria-label="delete"
                size="small"
              >
                <Icons.delete fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  setMenuid(params.data?.menu_key || "");
                  setEditData(params.data);
                  setEdit(true);
                  setMenuId(params.data?.menu_key || "");
                }}
                aria-label="edit"
                size="small"
              >
                <Icons.edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Tab">
              <IconButton
                onClick={() => {
                  setAddTabModal(true);
                  setSelectedRow(params.data);
                  setMenuId(params.data?.menu_key || "");
                }}
                aria-label="Add Tab"
                size="small"
              >
                <Icons.addtab className="onclick-animate-spin" fontSize="small" />
              </IconButton>
            </Tooltip>
            {params?.data?.url === null && (
              <Tooltip title="Add Menu">
                <IconButton
                  onClick={() => {
                    // dispatch(setMenuData(params.data));
                    handleOpenmodal();
                    setSelectedRow(params.data);
                  }}
                  aria-label="add"
                  size="small"
                >
                  <Icons.add className="onclick-animate-spin" fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {!!params.data.hasTab && (
              <Tooltip title="View Tab">
                <IconButton
                  onClick={() => {
                    setMenuid(params.data?.menu_key || "");
                    setMenuId(params.data?.menu_key || "");
                    setShowTabDialog(true);
                    dispatch(getMenuTabList(params.data?.menu_key || "")).then((res: any) => {
                      if (res?.payload?.data?.success) {
                        setTabData(res.payload.data.data);
                      }
                    });
                  }}
                  aria-label="delete"
                  size="small"
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },

      sortable: false,
      filter: false,
      maxWidth: 200,
      minWidth: 200,
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
    <div className="ag-theme-quartz h-[calc(100vh-130px)]">
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
      {open == true && <CreateMenu open={handleOpenmodal} onClose={handleClosemodal} selectedRow={selectedRow} setMenu={setMenu}/>}
      <CreateMenu open={edit} onClose={() => setEdit(false)} selectedRow={selectedRow} data={editData} menuId={menuId} setMenu={setMenu} />
      <SharedDialog
        open={openDelete}
        title="Delete Menu Item"
        content="Are you sure you want to delete this menu item? This action cannot be undone."
        onClose={() => setOpenDelete(false)} // Close dialog without action
        onConfirm={() => {
          if (menuToDelete) {
            dispatch(deleteMenu(menuToDelete)).then((res: any) => {
              if (res?.payload?.data?.success) {
                dispatch(getMenuList());
                setOpenDelete(false);
                setMenu("1");
              }
            });
          }
        }} // Confirm delete action
        confirmText="Continue"
        cancelText="Cancel"
        startIcon={<Icons.delete fontSize="small" />}
        loading={deleteMenuLoading}
      />
      <TabDetailsDialog open={showTabDialog} onClose={() => setShowTabDialog(false)} data={tabData} title="Tab Details" loading={menuListLoading} />
      <AddTab open={addTabModal} onClose={() => setAddTabModal(false)} selectedRow={selectedRow} menuId={menuId} />
    </div>
  );
};

export default TreeDataMenu;
