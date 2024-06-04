import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  levels: [],
};

const studentSlice = createSlice({
  name: "students",
  initialState: initialState,
  reducers: {
    saveStudentsData(state, action) {
      state.students = action.payload;
    },
    saveLevelsData(state, action) {
      state.levels = action.payload;
    },
  },
});

export const { saveStudentsData, saveLevelsData } = studentSlice.actions;
export default studentSlice.reducer;
