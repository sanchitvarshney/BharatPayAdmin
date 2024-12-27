import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authentication/authSlice";
import userReducer from "@/features/user/userSlice";
import permissionReducer from "@/features/permission/permissionSlice";
import menuReducer from "@/features/menu/menuSlice";
import isIdReducer from "@/features/menu/isIdReducer";
import locationSlice from "@/features/location/locationSlice";
import ProfileSlice from "@/features/profile/ProfileSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    permission: permissionReducer,
    menu: menuReducer,
    isId: isIdReducer,
    location: locationSlice,
    profile:ProfileSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
