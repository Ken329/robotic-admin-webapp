import { configureStore } from "@reduxjs/toolkit";

import { baseApiSlice } from "./createAppApi";
import appReducer from "./slices/app";
import studentsReducer from "./slices/students";
import centresReducer from "./slices/centre";
import achievementsReducer from "./slices/achievements";

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    app: appReducer,
    students: studentsReducer,
    centres: centresReducer,
    achievements: achievementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
  devTools: true,
});

export default store;
