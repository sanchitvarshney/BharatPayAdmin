import axiosInstance from "@/api/baratpayDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CreateRolePayload, CreateRoleResponse, PermissionState, RolesListResponse } from "./permissionType";
import { showToast } from "@/utills/toasterContext";
const initialState: PermissionState = {
  createRoleLoading: false,
  rolelistData: null,
  roleListLoading: false,
  userRoleList: null,
  asignRoleLoading: false,
  deleteRoleLoading: false,
  updateRoleLoading: false,
};

export const createRole = createAsyncThunk<AxiosResponse<CreateRoleResponse>, CreateRolePayload>("permission/createRole", async (payload) => {
  const response = await axiosInstance.post("/role/createRole", payload);
  return response;
});
export const getRoleList = createAsyncThunk<AxiosResponse<RolesListResponse>>("permission/getRoleList", async () => {
  const response = await axiosInstance.get("/role/getRoles");
  return response;
});

export const getUserRole = createAsyncThunk<AxiosResponse<any>, string>(`/role/getUserMenu`, async (id) => {
  const response = await axiosInstance.get(`/role/users/${id}`);
  return response;
});

export const assignRole = createAsyncThunk<AxiosResponse<any>, any>("permission/assignRole", async (payload) => {
  const response = await axiosInstance.post("/role/assignRole", payload);
  return response;
});
export const deleteRole = createAsyncThunk<AxiosResponse<{ message: string; success: boolean }>, string>("permission/deleteRole", async (id) => {
  const response = await axiosInstance.delete(`/role/deleteRole/${id}`);
  return response;
});
export const editRole = createAsyncThunk<AxiosResponse<{ message: string; success: boolean }>, { id: string; name: string; description: string }>("permission/editRole", async (payload) => {
  const response = await axiosInstance.put(`/role/renameRole/${payload.id}`, payload);
  return response;
});

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRole.pending, (state) => {
        state.createRoleLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        if (action.payload.data.success) {
        }
        state.createRoleLoading = false;
      })
      .addCase(createRole.rejected, (state) => {
        state.createRoleLoading = false;
      })
      .addCase(getRoleList.pending, (state) => {
        state.roleListLoading = true;
        state.rolelistData = null;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.rolelistData = action.payload.data.roles;
        }
        state.roleListLoading = false;
      })
      .addCase(getRoleList.rejected, (state) => {
        state.roleListLoading = false;
        state.rolelistData = null;
      })
      .addCase(getUserRole.pending, (state) => {
        state.userRoleList = null;
        state.roleListLoading = true;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.userRoleList = action.payload.data.data;
        }
        state.roleListLoading = false;
      })
      .addCase(getUserRole.rejected, (state) => {
        state.roleListLoading = false;
        state.userRoleList = null;
      })
      .addCase(assignRole.pending, (state) => {
        state.asignRoleLoading = true;
      })
      .addCase(assignRole.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
        state.asignRoleLoading = false;
      })
      .addCase(assignRole.rejected, (state) => {
        state.asignRoleLoading = false;
      })
      .addCase(deleteRole.pending, (state) => {
        state.deleteRoleLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
        state.deleteRoleLoading = false;
      })
      .addCase(deleteRole.rejected, (state) => {
        state.deleteRoleLoading = false;
      })
      .addCase(editRole.pending, (state) => {
        state.updateRoleLoading = true;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
        state.updateRoleLoading = false;
      })
      .addCase(editRole.rejected, (state) => {
        state.updateRoleLoading = false;
      });
  },
});

export default permissionSlice.reducer;
