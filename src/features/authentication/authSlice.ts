import axiosInstance from "@/api/baratpayDashApi";
import { getToken, setToken } from "@/utills/tokenUtills";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AuthState, LoginResponse, OTPResponse } from "./authType";

export type LoginCredentials = {
  username: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  token: getToken(),
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

export const verifyOtp = createAsyncThunk<AxiosResponse<OTPResponse>, LoginCredentials>("user/verify-otp", async (loginCredential) => {
  const response = await axiosInstance.put<OTPResponse>("/user/update-password", loginCredential);
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
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          setToken(action.payload.data.data?.token);
          localStorage.setItem("loggedinUser", JSON.stringify(action.payload.data.data));
          state.token = action.payload.data.data?.token;
        }
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
