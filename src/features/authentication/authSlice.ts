import axiosInstance from "@/api/baratpayDashApi";
import { getToken, setToken } from "@/utills/tokenUtills";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AuthState, LoginResponse, OTPResponse } from "./authType";
import { showToast } from "@/utills/toasterContext";

export type LoginCredentials = {
  username: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  token: getToken(),
  changepasswordloading: false,
  updateEmailLoading: false,
  emailOtpLoading: false,
  qrStatus: null,
  qrCodeLoading: false
};

export const loginUserAsync = createAsyncThunk<AxiosResponse<LoginResponse>, LoginCredentials>("auth/signin", async (loginCredential) => {
  const response = await axiosInstance.post<LoginResponse>("/auth/signin", loginCredential);
  return response;
});

export const getPasswordOtp = createAsyncThunk<
any, // Return type (you can define a specific type here based on your API response)
string // Argument type (the type of email)
>(
  `/user/menu/getUserMenu`, // Action name
  async (email, { rejectWithValue }) => {
    try {
      // Make the GET request to the correct endpoint
      const response = await axiosInstance.get(`/user/get-password-otp`, {
        params: { emailId: email } // Use query parameters correctly
      });

      return response.data; // Return only the data from the response
    } catch (error:any) {
      // Handle error and reject with the error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getQRStatus = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { crnId: string }>("auth/getQRStatus", async () => {
  const response = await axiosInstance.get(`auth/qrCode`);
  return response;
});

export const verifyOtpAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { otp: string,secret:string }>("auth/verifyOtpAsync", async (paylaod) => {
  const response = await axiosInstance.post("/auth/verify", paylaod);
  return response;
})

export const verifyOtp = createAsyncThunk<AxiosResponse<OTPResponse>, LoginCredentials>("user/verify-otp", async (loginCredential) => {
  const response = await axiosInstance.put<OTPResponse>("/user/update-password", loginCredential);
  return response;
});

export const changePasswordAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, any>("auth/changePassword", async (payload) => {
  const response = await axiosInstance.put("/user/change-my-password", payload);
  return response;
});

export const updateEmailAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { emailId: string; otp: string }>("auth/updateEmailAsync", async (paylaod) => {
  const response = await axiosInstance.put("/user/verify-email-otp", paylaod);
  return response;
});

export const getEmailOtpAsync = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>>("auth/getEmailOtpAsycn", async () => {
  const response = await axiosInstance.get("/user/get-email-otp");
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.clear();
      state.user = null;
      state.token = null;
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAsync.fulfilled, (state, action:any) => {
        if (action.payload.data.success) {
          setToken(action.payload.data.data?.token);
          // localStorage.setItem("loggedinUser", JSON.stringify(action.payload.data.data));
          localStorage.setItem("loggedinUser", btoa(JSON.stringify(action.payload.data.data)));

          // state.token = action.payload.data.data?.token;
        }
        if(!action.payload.data.data){
          state.qrStatus = action.payload.data;
          localStorage.setItem("showOtpPage",action?.payload?.data?.isTwoStep);
        }
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.qrCodeLoading = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action:any) => {
        if (action.payload.data.success) {
          setToken(action.payload.data.data?.token);
          localStorage.setItem("showOtpPage","");
          localStorage.setItem("loggedinUser", btoa(JSON.stringify(action.payload.data.data)));
        }
        if(!action.payload.data.data){
          state.qrStatus = action.payload.data;
        }
        state.qrCodeLoading = false;
      })
      .addCase(verifyOtpAsync.rejected, (state) => {
        state.qrCodeLoading = false;
      })
      .addCase(updateEmailAsync.pending, (state) => {
        state.updateEmailLoading = true;
      })
      .addCase(updateEmailAsync.fulfilled, (state, action) => {
        state.updateEmailLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(updateEmailAsync.rejected, (state) => {
        state.updateEmailLoading = false;
      })
      .addCase(getEmailOtpAsync.pending, (state) => {
        state.emailOtpLoading = true;
      })
      .addCase(getEmailOtpAsync.fulfilled, (state, action) => {
        state.emailOtpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(getEmailOtpAsync.rejected, (state) => {
        state.emailOtpLoading = false;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.changepasswordloading = true;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.changepasswordloading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(changePasswordAsync.rejected, (state) => {
        state.changepasswordloading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
