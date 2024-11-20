import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for your slice state
interface IsIdState {
  isId: string | null;
}

// Define the initial state using that type
const initialState: IsIdState = {
  isId: null,
};

// Create a slice for isId
const isIdSlice = createSlice({
  name: "isId",
  initialState,
  reducers: {
    setIsId: (state, action: PayloadAction<string>) => {
      state.isId = action.payload;
    },
    resetIsId: (state) => {
      state.isId = null;
    },
  },
});

// Export the actions
export const { setIsId, resetIsId } = isIdSlice.actions;

// Export the reducer
export default isIdSlice.reducer;
