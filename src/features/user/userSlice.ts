import axiosInstance from "@/api/baratpayDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  AdduserApiResponse,
  AddUserPayload,
  AdduserSatates,
  ChangePasswordResponse,
  ChangeUserPasswordPayload,
  UpdateEmailPayload,
  UpdateMobilePayload,
  UpdateuserProfilePayload,
  UserApiResponse,
  UserProfileResponse,
} from "./userType";
import { showToast } from "@/utills/toasterContext";
import { RolesListResponse } from "@/features/permission/permissionType";

const initialState: AdduserSatates = {
  addUserloading: false,
  userList: null,
  getUserListLoading: false,
  getUserProfileLoading: false,
  userProfile: null,
  cahngeUserPasswordLoading: false,
  updateUserEmailLoading: false,
  updateUserMobileLoading: false,
  suspendUserLoading: false,
  activateUserLoading: false,
  updateUserProfileLoading: false,
  rolelistData: null,
  loading: false,
};

export const addUser = createAsyncThunk<
  AxiosResponse<AdduserApiResponse>,
  AddUserPayload
>("user/create", async (paylod) => {
  const response = await axiosInstance.post("/user/create", paylod);
  return response;
});
export const getUserList = createAsyncThunk<
  AxiosResponse<UserApiResponse>,
  string
>("user/getUserList", async (type) => {
  const response = await axiosInstance.get(`/user/list/${type}`);
  return response;
});

export const getRoleList = createAsyncThunk<AxiosResponse<RolesListResponse>>(
  "permission/getRoleList",
  async () => {
    const response = await axiosInstance.get("/role/getRoles");
    return response;
  }
);

export const getUserProfile = createAsyncThunk<
  AxiosResponse<UserProfileResponse>,
  string
>("user/getUserProfile", async (id) => {
  const response = await axiosInstance.get(`/user/details/${id}`);
  if (response.data.success) {
    showToast("Data Fetched Successfully", "success");
  }
  return response;
});
export const changeuserPasword = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  ChangeUserPasswordPayload
>("user/changeuserPasword", async (paylod) => {
  const response = await axiosInstance.put(
    `/user/change-user-password`,
    paylod
  );
  return response;
});
export const updateUserEmail = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  UpdateEmailPayload
>("user/updateUserEmail", async (paylod) => {
  const response = await axiosInstance.put(`/user/update-email-id`, paylod);
  return response;
});
export const updateUserMobile = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  UpdateMobilePayload
>("user/updateUserMobile", async (paylod) => {
  const response = await axiosInstance.put(
    `/user/update-user-mobile-no`,
    paylod
  );
  return response;
});
export const suspendUser = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  string
>("user/suspendUser", async (paylod) => {
  const response = await axiosInstance.put(`/user/${paylod}/suspend`);
  return response;
});
export const activateUser = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  string
>("user/activateUser", async (paylod) => {
  const response = await axiosInstance.put(`/user/${paylod}/activate`);
  return response;
});
export const updateUserProfile = createAsyncThunk<
  AxiosResponse<any>,
  UpdateuserProfilePayload
>("user/updateUserProfile", async (paylod) => {
  const response = await axiosInstance.put(`/user/update`, paylod);
  return response;
});

export const requirePasswordChange = createAsyncThunk<AxiosResponse<any>, any>(
  "user/requirePasswordChange",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/user/require-password-change`,
      paylod
    );
    return response;
  }
);

export const updateUserStatus = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateUserStatus",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/user/update-user-status`,
      paylod
    );
    return response;
  }
);
export const updateUserVerification = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateUserVerification",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/user/update-user-verification-status`,
      paylod
    );
    return response;
  }
);
export const userLoginLogs = createAsyncThunk<AxiosResponse<any>, any>(
  "/user/userLoginLogs",
  async (payload) => {
    const response = await axiosInstance.get(
      `/user/userLoginLogs?user_id=${payload}`
    );
    return response;
  }
);
export const notificationPending = createAsyncThunk<AxiosResponse<any>>(
  "/notification/pending",
  async () => {
    const response = await axiosInstance.get("/notification/pending");
    return response;
  }
);
export const notificationPendingDelete = createAsyncThunk<
  AxiosResponse<any>,
  any
>("/notification/pending", async (id) => {
  const response = await axiosInstance.delete(`/notification/pending/${id}`);
  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.addUserloading = true;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.addUserloading = false;
      })
      .addCase(addUser.rejected, (state) => {
        state.addUserloading = false;
      })
      .addCase(getUserList.pending, (state) => {
        state.getUserListLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.getUserListLoading = false;
        if (action.payload.data.success) {
          state.userList = action.payload.data.data;
        }
      })
      .addCase(getUserList.rejected, (state) => {
        state.getUserListLoading = false;
        state.userList = [];
      })
      .addCase(getUserProfile.pending, (state) => {
        state.getUserProfileLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.getUserProfileLoading = false;
        if (action.payload.data.success) {
          state.userProfile = action.payload.data.data;
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.getUserProfileLoading = false;
        state.userProfile = [];
      })
      .addCase(changeuserPasword.pending, (state) => {
        state.cahngeUserPasswordLoading = true;
      })
      .addCase(changeuserPasword.fulfilled, (state, action) => {
        state.cahngeUserPasswordLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "Password changed successfully",
            "success"
          );
        }
      })
      .addCase(changeuserPasword.rejected, (state) => {
        state.cahngeUserPasswordLoading = false;
      })
      .addCase(updateUserEmail.pending, (state) => {
        state.updateUserEmailLoading = true;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.updateUserEmailLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserEmail.rejected, (state) => {
        state.updateUserEmailLoading = false;
      })
      .addCase(updateUserMobile.pending, (state) => {
        state.updateUserMobileLoading = true;
      })
      .addCase(updateUserMobile.fulfilled, (state, action) => {
        state.updateUserMobileLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message ||
              "Mobile number updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserMobile.rejected, (state) => {
        state.updateUserMobileLoading = false;
      })
      .addCase(suspendUser.pending, (state) => {
        state.suspendUserLoading = true;
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        state.suspendUserLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User suspended successfully",
            "success"
          );
        }
      })
      .addCase(suspendUser.rejected, (state) => {
        state.suspendUserLoading = false;
      })
      .addCase(activateUser.pending, (state) => {
        state.activateUserLoading = true;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.activateUserLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User activated successfully",
            "success"
          );
        }
      })
      .addCase(activateUser.rejected, (state) => {
        state.activateUserLoading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateUserProfileLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateUserProfileLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "Profile updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.updateUserProfileLoading = false;
      })
      .addCase(getRoleList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.rolelistData = action.payload.data.roles;
        }
        state.loading = false;
      })
      .addCase(getRoleList.rejected, (state) => {
        state.loading = false;
        state.rolelistData = [];
      })
      .addCase(notificationPending.pending, (state) => {
        state.loading = true;
      })
      .addCase(notificationPending.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.rolelistData = action.payload.data.roles;
        }
        state.loading = false;
      })
      .addCase(notificationPending.rejected, (state) => {
        state.loading = false;
        state.rolelistData = [];
      });
  },
});

export default userSlice.reducer;
