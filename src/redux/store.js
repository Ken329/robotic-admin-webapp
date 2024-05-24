import { configureStore } from "@reduxjs/toolkit";

import { baseApiSlice } from "./createAppApi";
import appReducer from "./slices/app";

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
  devTools: true,
});

export default store;
