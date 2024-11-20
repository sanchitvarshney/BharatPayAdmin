import axiosInstance from "@/api/baratpayDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CreateRolePayload, CreateRoleResponse, PermissionState, RolesListResponse } from "./permissionType";
const initialState: PermissionState = {
  createRoleLoading: false,
  rolelistData: null,
  roleListLoading: false,
};

export const createRole = createAsyncThunk<AxiosResponse<CreateRoleResponse>, CreateRolePayload>("permission/createRole", async (payload) => {
  const response = await axiosInstance.post("/role/createRole", payload);
  return response;
});
export const getRoleList = createAsyncThunk<AxiosResponse<RolesListResponse>>("permission/getRoleList", async () => {
  const response = await axiosInstance.get("/role/getRoles");
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
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.rolelistData = action.payload.data.roles;
        }
        state.roleListLoading = false;
      })
      .addCase(getRoleList.rejected, (state) => {
        state.roleListLoading = false;
        state.rolelistData = [];
      });
  },
});

export default permissionSlice.reducer;
