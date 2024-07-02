import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  files: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    saveBlogsData(state, action) {
      state.blogs = action.payload;
    },
    saveFilesData(state, action) {
      state.files = action.payload;
    },
  },
});

export const { saveBlogsData, saveFilesData } = postsSlice.actions;
export default postsSlice.reducer;
