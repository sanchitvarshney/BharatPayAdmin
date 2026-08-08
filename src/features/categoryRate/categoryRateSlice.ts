import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CategoryRateListResponse,
  CategoryRateState,
  CreateCategoryRateResponse,
  CreateCategoryRateType,
  UpdateCategoryRateType,
} from "./categoryRateType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";

const initialState: CategoryRateState = {
  createCategoryRateLoading: false,
  categoryRateListLoading: false,
  categoryRateList: null,
  updateCategoryRateLoading: false,
};

export const createCategoryRate = createAsyncThunk<AxiosResponse<CreateCategoryRateResponse>, CreateCategoryRateType>(
  "categoryRate/createCategoryRate",
  async (payload) => {
    const response = await axiosInstance.post("/masterRate/addCategoryRate", payload);
    return response;
  },
);

export const getCategoryRateList = createAsyncThunk<AxiosResponse<CategoryRateListResponse>>(
  "categoryRate/getCategoryRateList",
  async () => {
    const response = await axiosInstance.get("/masterRate/getCategoryRates");
    return response;
  },
);

export const updateCategoryRate = createAsyncThunk<AxiosResponse<CreateCategoryRateResponse>, { payload: UpdateCategoryRateType }>(
  "categoryRate/updateCategoryRate",
  async ({ payload }) => {
    const response = await axiosInstance.post("/masterRate/Category-update", payload);
    return response;
  },
);

const categoryRateSlice = createSlice({
  name: "categoryRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryRate.pending, (state) => {
        state.createCategoryRateLoading = true;
      })
      .addCase(createCategoryRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Category rate created successfully.", "success");
        }
        state.createCategoryRateLoading = false;
      })
      .addCase(createCategoryRate.rejected, (state) => {
        state.createCategoryRateLoading = false;
      })
      .addCase(getCategoryRateList.pending, (state) => {
        state.categoryRateListLoading = true;
      })
      .addCase(getCategoryRateList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.categoryRateList = action.payload.data.data;
        }
        state.categoryRateListLoading = false;
      })
      .addCase(getCategoryRateList.rejected, (state) => {
        state.categoryRateListLoading = false;
        state.categoryRateList = null;
      })
      .addCase(updateCategoryRate.pending, (state) => {
        state.updateCategoryRateLoading = true;
      })
      .addCase(updateCategoryRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Category rate updated successfully.", "success");
        }
        state.updateCategoryRateLoading = false;
      })
      .addCase(updateCategoryRate.rejected, (state) => {
        state.updateCategoryRateLoading = false;
      });
  },
});

export default categoryRateSlice.reducer;
