import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  centres: [],
};

const centreSlice = createSlice({
  name: "centres",
  initialState: initialState,
  reducers: {
    saveCentresData(state, action) {
      state.centres = action.payload;
    },
  },
});

export const { saveCentresData } = centreSlice.actions;
export default centreSlice.reducer;
