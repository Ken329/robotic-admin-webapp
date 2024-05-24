import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
  students: [],
  centres: [],
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    saveUserData(state, action) {
      state.userData = action.payload;
    },
    saveStudentList(state, action) {
      state.students = action.payload;
    },
    saveCentreList(state, action) {
      state.centres = action.payload;
    },
    resetApp(state) {
      state.userData = null;
      localStorage.removeItem("token");
    },
  },
});

export const { saveUserData, saveStudentList, saveCentreList, resetApp } =
  appSlice.actions;
export default appSlice.reducer;
