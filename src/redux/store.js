import { configureStore } from '@reduxjs/toolkit';

import { baseApiSlice } from './createAppApi';
import achievementsReducer from './slices/achievements';
import appReducer from './slices/app';
import centresReducer from './slices/centre';
import postsReducer from './slices/posts';
import studentsReducer from './slices/students';

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
