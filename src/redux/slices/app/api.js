import { baseApiSlice } from "../../createAppApi";

export const appApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserData: builder.query({
        query: () => ({
          url: "/user",
        }),
      }),
      maintenanceCheck: builder.query({
        query: () => ({
          url: "/maintenance",
        }),
      }),
    };
  },
});

export const { useGetUserDataQuery, useMaintenanceCheckQuery } = appApi;
