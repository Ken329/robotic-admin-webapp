import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
  token: null,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    saveUserData(state, action) {
      state.userData = action.payload;
    },
    saveToken(state, action) {
      state.token = action.payload;
    },
    resetApp(state) {
      state.userData = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { saveUserData, saveToken, resetApp } = appSlice.actions;
export default appSlice.reducer;
