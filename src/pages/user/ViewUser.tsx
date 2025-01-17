import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getUserList } from "@/features/user/userSlice";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import Avatar from "@mui/material/Avatar";
import { Icons } from "@/components/icons/icons";
import { IconButton } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { findMenuKey } from "@/general";

const ViewUser = () => {
  const [value, setValue] = React.useState("1");
  const dispatch = useAppDispatch();
  const { getUserListLoading, userList } = useAppSelector(
    (state) => state.user
  );
  const { menuList } = useAppSelector((state: any) => state.menu);

  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(
    () => findMenuKey(window.location.pathname,menuList),
    [menuList]
  );

  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  // Fetch user list when menuKey changes
  useEffect(() => {
    dispatch(getUserList("1"));
  }, [menuKey, dispatch]);

  // Handle radio button change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    setValue(newValue);
    dispatch(getUserList(newValue));
  };

  const columns: ColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      minWidth: 200,
      maxWidth: 400,
      filter: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-[10px] py-[5px] max-w-max ">
          <Avatar src={"https://material-ui.com/static/images/avatar/1.jpg"} />
          <Link
            to={`/user/view-user/${params?.data?.userID}`}
            className="text-blue-600 flex items-center gap-[5px]"
          >
            {params.value}
            <Icons.followLink fontSize="small" sx={{ fontSize: "15px" }} />
          </Link>
        </div>
      ),
      autoHeight: true,
      flex: 1,
    },
    {
      field: "emailID",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      maxWidth: 400,
      filter: true,
    },
    { field: "mobileNo", headerName: "Mobile No.",filter: true},
    { field: "gender", headerName: "Gender" },
    { field: "role", headerName: "Role",filter: true },
    { field: "userID", headerName: "userID", hide: true },
  ];

  return (
    <div className="h-full">
      <div className="h-[50px] flex items-center gap-[20px] px-[10px] text-blue-600 border-b justify-between ">
        <div className="flex items-center gap-[20px]">
          <Link to={"/user/add-user"} className="flex items-center gap-[5px]">
            <Icons.add fontSize="small" />
            Add new user
          </Link>
        </div>
        <div className="flex items-center gap-[15px]">
          <IconButton onClick={() => dispatch(getUserList("1"))}>
            <Icons.refresh />
          </IconButton>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <div className="flex items-center gap-[15px]">
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Active User"
              />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Inactive User"
              />
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className={"ag-theme-quartz h-[calc(100vh-130px)] "}>
        <AgGridReact
          rowHeight={60}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          loading={getUserListLoading}
          rowData={userList ? userList : []}
          columnDefs={columns}
          pagination
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default ViewUser;
