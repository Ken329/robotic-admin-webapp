import { baseApiSlice } from '@redux/createAppApi';
import achievementsReducer from '@redux/slices/achievements';
import appReducer from '@redux/slices/app';
import centresReducer from '@redux/slices/centre';
import postsReducer from '@redux/slices/posts';
import studentsReducer from '@redux/slices/students';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    app: appReducer,
    students: studentsReducer,
    centres: centresReducer,
    achievements: achievementsReducer,
    posts: postsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApiSlice.middleware),
  devTools: true
});

export default store;
