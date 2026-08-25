import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";
import { ComponentRateListResponse, ComponentRateState } from "./componentRateType";

const LIST_ENDPOINT = "/component";
const UPDATE_ENDPOINT = "/component/department_rate";

const initialState: ComponentRateState = {
  componentRateListLoading: false,
  componentRateList: null,
  updateComponentRateLoading: false,
};

export const getComponentRateList = createAsyncThunk<AxiosResponse<ComponentRateListResponse>>(
  "componentRate/getComponentRateList",
  async () => {
    const response = await axiosInstance.get(LIST_ENDPOINT);
    return response;
  },
);

export const updateComponentRate = createAsyncThunk<AxiosResponse<any>, any>(
  "componentRate/updateComponentRate",
  async ({ payload }) => {
    const response = await axiosInstance.put(UPDATE_ENDPOINT, payload);
    return response;
  },
);

const componentRateSlice = createSlice({
  name: "componentRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComponentRateList.pending, (state) => {
        state.componentRateListLoading = true;
      })
      .addCase(getComponentRateList.fulfilled, (state, action) => {
        const data: any = action.payload.data;
        const list = data?.data?.components;
        state.componentRateList = Array.isArray(list) ? list : [];
        state.componentRateListLoading = false;
      })
      .addCase(getComponentRateList.rejected, (state) => {
        state.componentRateListLoading = false;
        state.componentRateList = null;
      })
      .addCase(updateComponentRate.pending, (state) => {
        state.updateComponentRateLoading = true;
      })
      .addCase(updateComponentRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Component updated successfully.", "success");
        }
        state.updateComponentRateLoading = false;
      })
      .addCase(updateComponentRate.rejected, (state) => {
        state.updateComponentRateLoading = false;
      });
  },
});

export default componentRateSlice.reducer;
