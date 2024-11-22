import axiosInstance from "@/api/baratpayDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  CreateMenuResponse,
  CreateMenuType,
  MenuListResponse,
  MenuState,
} from "./menuType";
import { showToast } from "@/utills/toasterContext";

const initialState: MenuState = {
  createMenuLoading: false,
  menuListLoading: false,
  menuList: null,
  userList: null,
  deleteMenuLoading: false,
  disableMenuLoading: false,
  isId: null,
};
// Define a type for your slice state

export const createMenu = createAsyncThunk<
  AxiosResponse<CreateMenuResponse>,
  CreateMenuType
>("menu/createMenu", async (payload) => {
  const response = await axiosInstance.post("/menu/createMenu", payload);
  return response;
});

export const getMenuList = createAsyncThunk<AxiosResponse<MenuListResponse>>(
  "menu/getMenuList",
  async () => {
    const response = await axiosInstance.get("/menu/getMenu");
    return response;
  }
);
export const getUserMenu = createAsyncThunk<
  AxiosResponse<MenuListResponse>,
  string
>(`/user/menu/getUserMenu`, async (id) => {
  const response = await axiosInstance.get(`/permission/getUserMenu/${id}`);
  return response;
});
export const getRoleMenu = createAsyncThunk<
  AxiosResponse<MenuListResponse>,
   string
>(`/user/menu/getRoleMenu`, async (payload) => {
  const response = await axiosInstance.get(`/permission/getRoleMenu/${payload}`);
  return response;
});
export const saveUserMenuPermission = createAsyncThunk<
  AxiosResponse<MenuListResponse>,
  any
>("/user/menu/saveUserMenuPermission", async (payload: any) => {
  const response = await axiosInstance.post(
    "/permission/saveUserMenuPermission",
    payload
  );
  return response;
});
export const saveRoleMenuPermission = createAsyncThunk<
  AxiosResponse<MenuListResponse>,any
>("/user/menu/saveRoleMenuPermission", async (payload) => {
  const response = await axiosInstance.post(
    "/permission/saveRoleMenuPermission",
    payload
  );
  return response;
});
export const getActiveUser = createAsyncThunk<AxiosResponse<MenuListResponse>>(
  "/user/active",
  async () => {
    const response = await axiosInstance.get("/user/active");
    return response;
  }
);
export const getRoleList = createAsyncThunk<AxiosResponse<MenuListResponse>>(
  "/user/roleList",
  async () => {
    const response = await axiosInstance.get("/user/roleList");
    return response;
  }
);
export const menustatusChange = createAsyncThunk<
  AxiosResponse<{ message: string; success: boolean }>,
  { id: string; statue: number }
>("menu/menustatusChange", async (payload) => {
  const response = await axiosInstance.post(
    `/menu/status/${payload.id}/${payload.statue}`
  );
  return response;
});
export const deleteMenu = createAsyncThunk<
  AxiosResponse<{ message: string; success: boolean }>,
  string
>("menu/deleteMenu", async (id) => {
  const response = await axiosInstance.delete(`/menu/deleteMenu/${id}`);
  return response;
});

const authSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMenu.pending, (state) => {
        state.createMenuLoading = true;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(
            action.payload.data?.message || "Menu created successfully.",
            "success"
          );
        }
        state.createMenuLoading = false;
      })
      .addCase(createMenu.rejected, (state) => {
        state.createMenuLoading = false;
      })
      .addCase(getMenuList.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.menuList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(getMenuList.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(getActiveUser.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(getActiveUser.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.menuList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(getActiveUser.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(getRoleList.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.userList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(getRoleList.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(saveRoleMenuPermission.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(saveRoleMenuPermission.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.userList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(saveRoleMenuPermission.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(saveUserMenuPermission.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(saveUserMenuPermission.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(saveUserMenuPermission.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.userList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })

      .addCase(getUserMenu.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(getUserMenu.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.menuList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(getUserMenu.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(getRoleMenu.pending, (state) => {
        state.menuListLoading = true;
      })
      .addCase(getRoleMenu.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.menuList = action.payload?.data?.menu;
        }
        state.menuListLoading = false;
      })
      .addCase(getRoleMenu.rejected, (state) => {
        state.menuListLoading = false;
        state.menuList = null;
      })
      .addCase(menustatusChange.pending, (state) => {
        state.disableMenuLoading = true;
      })
      .addCase(menustatusChange.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(
            action.payload.data?.message || "Menu status changed successfully.",
            "success"
          );
        }
        state.disableMenuLoading = false;
      })
      .addCase(menustatusChange.rejected, (state) => {
        state.disableMenuLoading = false;
      })
      .addCase(deleteMenu.pending, (state) => {
        state.deleteMenuLoading = true;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.deleteMenuLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload.data?.message || "Menu deleted successfully.",
            "success"
          );
        }
        state.deleteMenuLoading = false;
      })
      .addCase(deleteMenu.rejected, (state) => {
        state.deleteMenuLoading = true;
        state.deleteMenuLoading = false;
      });
  },
});

export default authSlice.reducer;
