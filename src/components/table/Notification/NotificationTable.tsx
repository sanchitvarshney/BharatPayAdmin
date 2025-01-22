import React, { useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import {
  notificationPending,
  notificationPendingDelete,
} from "@/features/user/userSlice";
import { Icons } from "@/components/icons/icons";
import SharedDialog from "@/components/shared/SharedDialog";
import { showToast } from "@/utills/toasterContext";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { findMenuKey } from "@/general";

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

// type Props = {
//   setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedType: string;
//   selectedVal: string;
//   updateRow: any;
// };

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

const NotificationTable = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { menuList } = useAppSelector((state) => state.menu);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  const [openUser, setOpenUser] = useState<any>(false);
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: "Delete",
      field: "",
      // flex: 1,\
      width: 80,
      maxWidth: 80,
      cellRenderer: (params: any) => {
        // Get the role_name and role_id from the row data

        // Encode the role_name to make it URL-safe

        return (
          // <Link
          //   to={`/role/view-role/${roleId}?role_name=${encodedRoleName}`}
          //   className="text-blue-600 flex items-center gap-[10px]"
          // >
          //   {roleName}
          //   <Icons.followLink fontSize="small" sx={{ fontSize: "15px" }} />
          // </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Icons.delete
              fontSize="small"
              color="error"
              onClick={() => {
                setOpenUser(params);
              }}
            />
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      filter: true,
      maxWidth: 300,
      flex: 1,
      minWidth: 150,
      autoHeight: true,
    },
    // { field: "url", headerName: "URL",maxWidth: 300,
    //   minWidth: 150,
    //   autoHeight: true, },
    { field: "moduleName", headerName: "Module Name ", flex: 1 },
    { field: "req_code", headerName: "Request Code " },
    { field: "userName", headerName: "User Name" },
  ]);

  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(() => findMenuKey(window.location.pathname, menuList), [menuList]);
  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      floatingFilter: true,
      filter: "agTextColumnFilter",
    }),
    []
  );

  const getDataForTable = async () => {
    dispatch(notificationPending()).then((res: any) => {
      if (res?.payload?.data?.success) {
        if(res.payload.data.data.length == 0){
          setRowData([]);
        };
        setRowData(res?.payload?.data?.data);
      }
      else{
        setRowData([]);
      }
    });
  };
  const deleteNotification = async () => {
    dispatch(notificationPendingDelete(openUser?.data?.id)).then((res: any) => {
      if (res?.payload?.data?.success) {
        setOpenUser(false);
        getDataForTable();
        showToast(res.payload.data.message, "success");
      } else {
        setOpenUser(false);
        showToast(res.payload.data.message, "error");
      }
    });
  };
  useEffect(() => {
    // Only set the rowData when menuList is not empty
    if (menuList && Array.isArray(menuList)) {
      setRowData(flattenMenuHierarchy(menuList));
    }
  }, [menuList]);

  useEffect(() => {
    getDataForTable();
  }, [dispatch]);

  return (
    <>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          rowData={rowData}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
      <SharedDialog
        open={openUser}
        loading={loading}
        title="Delete Notification"
        content="Are you sure you want to delete this notification?"
        onClose={() => setOpenUser(false)}
        onConfirm={() => deleteNotification()}
        endIcon={<Icons.delete fontSize="small" />}
      />
    </>
  );
};

export default NotificationTable;
