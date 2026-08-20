import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateMasterRateResponse, CreateMasterRateType, MasterRateDetailResponse, MasterRateListResponse, MasterRateState, UpdateMasterRateType } from "./masterRateType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";

const initialState: MasterRateState = {
  createMasterRateLoading: false,
  masterRateListLoading: false,
  masterRateList: null,
  masterRateDetailLoading: false,
  updateMasterRateLoading: false,
};

export const createMasterRate = createAsyncThunk<AxiosResponse<CreateMasterRateResponse>, CreateMasterRateType>("masterRate/createMasterRate", async (payload) => {
  const response = await axiosInstance.post("/masterRate/add", payload);
  return response;
});

export const getMasterRateList = createAsyncThunk<AxiosResponse<MasterRateListResponse>>("masterRate/getMasterRateList", async () => {
  const response = await axiosInstance.get("/masterRate/getRate");
  return response;
});

export const getMasterRateDetail = createAsyncThunk<AxiosResponse<MasterRateDetailResponse>, string>("masterRate/getMasterRateDetail", async (rateKey) => {
  const response = await axiosInstance.get(`/masterRate/getRate/${rateKey}`);
  return response;
});

export const updateMasterRate = createAsyncThunk<AxiosResponse<CreateMasterRateResponse>, { payload: UpdateMasterRateType }>("masterRate/updateMasterRate", async ({ payload }) => {
  const response = await axiosInstance.put(`/masterRate/updateRate`, payload);
  return response;
});

const masterRateSlice = createSlice({
  name: "masterRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMasterRate.pending, (state) => {
        state.createMasterRateLoading = true;
      })
      .addCase(createMasterRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Master rate created successfully.", "success");
        }
        state.createMasterRateLoading = false;
      })
      .addCase(createMasterRate.rejected, (state) => {
        state.createMasterRateLoading = false;
      })
      .addCase(getMasterRateList.pending, (state) => {
        state.masterRateListLoading = true;
      })
      .addCase(getMasterRateList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.masterRateList = action.payload.data.data;
        }
        state.masterRateListLoading = false;
      })
      .addCase(getMasterRateList.rejected, (state) => {
        state.masterRateListLoading = false;
        state.masterRateList = null;
      })
      .addCase(getMasterRateDetail.pending, (state) => {
        state.masterRateDetailLoading = true;
      })
      .addCase(getMasterRateDetail.fulfilled, (state) => {
        state.masterRateDetailLoading = false;
      })
      .addCase(getMasterRateDetail.rejected, (state) => {
        state.masterRateDetailLoading = false;
      })
      .addCase(updateMasterRate.pending, (state) => {
        state.updateMasterRateLoading = true;
      })
      .addCase(updateMasterRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Master rate updated successfully.", "success");
        }
        state.updateMasterRateLoading = false;
      })
      .addCase(updateMasterRate.rejected, (state) => {
        state.updateMasterRateLoading = false;
      });
  },
});

export default masterRateSlice.reducer;
