import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  achievements: [],
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState: initialState,
  reducers: {
    saveAchievementsData(state, action) {
      state.achievements = action.payload;
    },
  },
});

export const { saveAchievementsData } = achievementsSlice.actions;
export default achievementsSlice.reducer;
