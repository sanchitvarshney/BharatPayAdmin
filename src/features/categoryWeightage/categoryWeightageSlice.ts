import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CategoryWeightageListResponse,
  CategoryWeightageState,
  CreateCategoryWeightageResponse,
} from "./categoryWeightageType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";

const initialState: CategoryWeightageState = {
  createCategoryWeightageLoading: false,
  categoryWeightageListLoading: false,
  categoryWeightageList: null,
  updateCategoryWeightageLoading: false,
};

export const createCategoryWeightage = createAsyncThunk<
  AxiosResponse<CreateCategoryWeightageResponse>,
  any
>("categoryWeightage/createCategoryWeightage", async (payload) => {
  const response = await axiosInstance.post("/masterWastage/addComponentWastage", payload);
  return response;
});

export const getCategoryWeightageList = createAsyncThunk<AxiosResponse<CategoryWeightageListResponse>>(
  "categoryWeightage/getCategoryWeightageList",
  async () => {
    const response = await axiosInstance.get("/masterWastage/getComponentWastage");
    return response;
  },
);

export const updateCategoryWeightage = createAsyncThunk<
  AxiosResponse<any>,
  any
>("categoryWeightage/updateCategoryWeightage", async ({ payload }) => {
  const response = await axiosInstance.post("/masterRate/Weightage-update", payload);
  return response;
});

const categoryWeightageSlice = createSlice({
  name: "categoryWeightage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryWeightage.pending, (state) => {
        state.createCategoryWeightageLoading = true;
      })
      .addCase(createCategoryWeightage.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Category weightage created successfully.", "success");
        }
        state.createCategoryWeightageLoading = false;
      })
      .addCase(createCategoryWeightage.rejected, (state) => {
        state.createCategoryWeightageLoading = false;
      })
      .addCase(getCategoryWeightageList.pending, (state) => {
        state.categoryWeightageListLoading = true;
      })
      .addCase(getCategoryWeightageList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.categoryWeightageList = action.payload.data.data;
        }
        state.categoryWeightageListLoading = false;
      })
      .addCase(getCategoryWeightageList.rejected, (state) => {
        state.categoryWeightageListLoading = false;
        state.categoryWeightageList = null;
      })
      .addCase(updateCategoryWeightage.pending, (state) => {
        state.updateCategoryWeightageLoading = true;
      })
      .addCase(updateCategoryWeightage.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Category weightage updated successfully.", "success");
        }
        state.updateCategoryWeightageLoading = false;
      })
      .addCase(updateCategoryWeightage.rejected, (state) => {
        state.updateCategoryWeightageLoading = false;
      });
  },
});

export default categoryWeightageSlice.reducer;
