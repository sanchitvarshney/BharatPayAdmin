import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";
import { VendorPricingEntry, VendorPricingListResponse, VendorPricingUpdateEntry, VendorRateState } from "./vendorRateType";

const ADD_ENDPOINT = "/adminPo/addVendorPricing";
const LIST_ENDPOINT = "/adminPo/getVendorPricing";
const UPDATE_ENDPOINT = "/adminPo/updateVendorPricing";

const initialState: VendorRateState = {
  createVendorRateLoading: false,
  vendorPricingListLoading: false,
  vendorPricingList: null,
  updateVendorPricingLoading: false,
};

export const createVendorRate = createAsyncThunk<AxiosResponse<any>, VendorPricingEntry[]>(
  "vendorRate/createVendorRate",
  async (payload) => {
    const response = await axiosInstance.post(ADD_ENDPOINT, payload);
    return response;
  },
);

export const getVendorPricingList = createAsyncThunk<AxiosResponse<VendorPricingListResponse>>(
  "vendorRate/getVendorPricingList",
  async () => {
    const response = await axiosInstance.get(LIST_ENDPOINT);
    return response;
  },
);

export const updateVendorPricing = createAsyncThunk<AxiosResponse<any>, VendorPricingUpdateEntry[]>(
  "vendorRate/updateVendorPricing",
  async (payload) => {
    const response = await axiosInstance.put(UPDATE_ENDPOINT, payload);
    return response;
  },
);

const vendorRateSlice = createSlice({
  name: "vendorRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVendorRate.pending, (state) => {
        state.createVendorRateLoading = true;
      })
      .addCase(createVendorRate.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Vendor pricing added successfully.", "success");
        }
        state.createVendorRateLoading = false;
      })
      .addCase(createVendorRate.rejected, (state) => {
        state.createVendorRateLoading = false;
      })
      .addCase(getVendorPricingList.pending, (state) => {
        state.vendorPricingListLoading = true;
      })
      .addCase(getVendorPricingList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.vendorPricingList = action.payload.data.data;
        }
        state.vendorPricingListLoading = false;
      })
      .addCase(getVendorPricingList.rejected, (state) => {
        state.vendorPricingListLoading = false;
        state.vendorPricingList = null;
      })
      .addCase(updateVendorPricing.pending, (state) => {
        state.updateVendorPricingLoading = true;
      })
      .addCase(updateVendorPricing.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "Vendor pricing updated successfully.", "success");
        }
        state.updateVendorPricingLoading = false;
      })
      .addCase(updateVendorPricing.rejected, (state) => {
        state.updateVendorPricingLoading = false;
      });
  },
});

export default vendorRateSlice.reducer;
