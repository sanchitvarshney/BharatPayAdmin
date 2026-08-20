import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authentication/authSlice";
import userReducer from "@/features/user/userSlice";
import permissionReducer from "@/features/permission/permissionSlice";
import menuReducer from "@/features/menu/menuSlice";
import isIdReducer from "@/features/menu/isIdReducer";
import locationSlice from "@/features/location/locationSlice";
import ProfileSlice from "@/features/profile/ProfileSlice";
import masterRateReducer from "@/features/masterRate/masterRateSlice";
import categoryRateReducer from "@/features/categoryRate/categoryRateSlice";
import categoryWeightageReducer from "@/features/categoryWeightage/categoryWeightageSlice";
import bharatpeCreditReducer from "@/features/bharatpeCredit/bharatpeCreditSlice";
import awbReducer from "@/features/awb/awbSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    permission: permissionReducer,
    menu: menuReducer,
    isId: isIdReducer,
    location: locationSlice,
    profile:ProfileSlice,
    masterRate: masterRateReducer,
    categoryRate: categoryRateReducer,
    categoryWeightage: categoryWeightageReducer,
    bharatpeCredit: bharatpeCreditReducer,
    awb: awbReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
