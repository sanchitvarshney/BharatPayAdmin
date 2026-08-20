import axiosInstance from "@/api/baratpayDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { AwbListParams, AwbListResponse, AwbState, UpdateAwbCountPayload, UpdateAwbCountResponse } from "./awbType";
import { showToast } from "@/utills/toasterContext";

const initialState: AwbState = {
  awbList: null,
  awbListLoading: false,
  total: 0,
  page: 1,
  limit: 10,
  updateCountLoading: false,
  updatingAwb: null,
};

export const getAwbList = createAsyncThunk<AxiosResponse<AwbListResponse>, AwbListParams>("awb/getAwbList", async (params) => {
  const response = await axiosInstance.get("/awb/get-list?partner=ALL", { params });
  return response;
});

export const updateAwbCount = createAsyncThunk<AxiosResponse<UpdateAwbCountResponse>, UpdateAwbCountPayload>("awb/updateAwbCount", async (payload) => {
  const response = await axiosInstance.post("/awb/update_count", payload);
  return response;
});

const awbSlice = createSlice({
  name: "awb",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAwbList.pending, (state) => {
        state.awbListLoading = true;
      })
      .addCase(getAwbList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.awbList = action.payload.data.data;
          state.total = action.payload.data.pagination.totalRecords;
          state.page = action.payload.data.pagination.currentPage;
          state.limit = action.payload.data.pagination.limit;
        }
        state.awbListLoading = false;
      })
      .addCase(getAwbList.rejected, (state) => {
        state.awbListLoading = false;
      })
      .addCase(updateAwbCount.pending, (state, action) => {
        state.updateCountLoading = true;
        state.updatingAwb = action.meta.arg.awb_nos;
      })
      .addCase(updateAwbCount.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
        state.updateCountLoading = false;
        state.updatingAwb = null;
      })
      .addCase(updateAwbCount.rejected, (state) => {
        state.updateCountLoading = false;
        state.updatingAwb = null;
      });
  },
});

export default awbSlice.reducer;
