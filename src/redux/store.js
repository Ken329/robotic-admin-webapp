import { baseApiSlice } from '@redux/createAppApi';
import achievementsReducer from '@redux/slices/achievements';
import appReducer from '@redux/slices/app';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    app: appReducer,
    achievements: achievementsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
