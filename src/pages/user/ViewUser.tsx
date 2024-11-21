import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getUserList } from "@/features/user/userSlice";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";

const ViewUser = () => {
  const dispatch = useAppDispatch();
  const { getUserListLoading, userList } = useAppSelector((state) => state.user);
  const columns: ColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      cellRenderer: (params: any) => (
        <Link to={`/user/view-user/${params?.data?.userID}`} className="text-blue-600">
          {params.value}
        </Link>
      ),
    },

    { field: "emailID", headerName: "Email", flex: 1, minWidth: 350 },
    { field: "mobileNo", headerName: "Mobile No.", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "type", headerName: "Role", flex: 1 },
    { field: "userID", headerName: "userID", flex: 1, hide: true },
  ];

  useEffect(() => {
    dispatch(getUserList("1"));
  }, []);

  return (
    <div className="p-[20px]">
      <div className="flex flex-col h-[calc(100vh-110px)]  rounded-sm shadow shadow-stone-400 relative  overflow-hidden">
        <div className="h-[50px] bg-zinc-100 flex items-center gap-[20px] px-[10px] text-blue-600 border-b  ">
          <Link to={"/user/add-user"} className="">
            Add new user
          </Link>
          <Link to={"#"} className="">
            Download users
          </Link>
        </div>
        <div className={"ag-theme-quartz h-[calc(100vh-160px)] "}>
          <AgGridReact overlayNoRowsTemplate={OverlayNoRowsTemplate} loadingOverlayComponent={CustomLoadingOverlay} suppressCellFocus={true} loading={getUserListLoading} rowData={userList ? userList : []} columnDefs={columns} pagination paginationPageSize={20} />
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
