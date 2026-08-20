import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BharatpeCreditListResponse,
  BharatpeCreditState,
  CreateBharatpeCreditResponse,
} from "./bharatpeCreditType";
import { AxiosResponse } from "axios";
import axiosInstance from "@/api/baratpayDashApi";
import { showToast } from "@/utills/toasterContext";


const CREATE_ENDPOINT = "/bpe/add";
const LIST_ENDPOINT = "/bpe/list";
const UPDATE_ENDPOINT = "/bpe/update";
const DELETE_ENDPOINT = "/bpe/delete";

const initialState: BharatpeCreditState = {
  createBharatpeCreditLoading: false,
  bharatpeCreditListLoading: false,
  bharatpeCreditList: null,
  updateBharatpeCreditLoading: false,
  deleteBharatpeCreditLoading: false,
};

export const createBharatpeCredit = createAsyncThunk<
  AxiosResponse<CreateBharatpeCreditResponse>,
  any
>("bharatpeCredit/createBharatpeCredit", async (payload) => {
  const response = await axiosInstance.post(CREATE_ENDPOINT, payload);
  return response;
});

export const getBharatpeCreditList = createAsyncThunk<AxiosResponse<BharatpeCreditListResponse>>(
  "bharatpeCredit/getBharatpeCreditList",
  async () => {
    const response = await axiosInstance.get(LIST_ENDPOINT);
    return response;
  },
);

export const updateBharatpeCredit = createAsyncThunk<
  AxiosResponse<any>,
  any
>("bharatpeCredit/updateBharatpeCredit", async ({ payload }) => {
  const response = await axiosInstance.put(UPDATE_ENDPOINT, payload);
  return response;
});
export const deleteBharatpeCredit = createAsyncThunk<
  AxiosResponse<any>,
  any
>("bharatpeCredit/deleteBharatpeCredit", async ({ payload }) => {
  const response = await axiosInstance.delete(DELETE_ENDPOINT, { data: payload });
  return response;
});

const bharatpeCreditSlice = createSlice({
  name: "bharatpeCredit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBharatpeCredit.pending, (state) => {
        state.createBharatpeCreditLoading = true;
      })
      .addCase(createBharatpeCredit.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "BharatPe Credit created successfully.", "success");
        }
        state.createBharatpeCreditLoading = false;
      })
      .addCase(createBharatpeCredit.rejected, (state) => {
        state.createBharatpeCreditLoading = false;
      })
      .addCase(getBharatpeCreditList.pending, (state) => {
        state.bharatpeCreditListLoading = true;
      })
      .addCase(getBharatpeCreditList.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          state.bharatpeCreditList = action.payload.data.data;
        }
        state.bharatpeCreditListLoading = false;
      })
      .addCase(getBharatpeCreditList.rejected, (state) => {
        state.bharatpeCreditListLoading = false;
        state.bharatpeCreditList = null;
      })
      .addCase(updateBharatpeCredit.pending, (state) => {
        state.updateBharatpeCreditLoading = true;
      })
      .addCase(updateBharatpeCredit.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "BharatPe Credit updated successfully.", "success");
        }
        state.updateBharatpeCreditLoading = false;
      })
      .addCase(updateBharatpeCredit.rejected, (state) => {
        state.updateBharatpeCreditLoading = false;
      })
        .addCase(deleteBharatpeCredit.pending, (state) => {
        state.deleteBharatpeCreditLoading = true;
      })
      .addCase(deleteBharatpeCredit.fulfilled, (state, action) => {
        if (action.payload.data.success) {
          showToast(action.payload.data?.message || "BharatPe Credit deleted successfully.", "success");
        }
        state.deleteBharatpeCreditLoading = false;
      })
      .addCase(deleteBharatpeCredit.rejected, (state) => {
        state.deleteBharatpeCreditLoading = false;
      });
  },
});

export default bharatpeCreditSlice.reducer;
