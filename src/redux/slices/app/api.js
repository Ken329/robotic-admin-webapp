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
      getAdminPanelData: builder.query({
        query: () => ({
          url: "/user/statuses",
        }),
      }),
    };
  },
});

export const {
  useGetUserDataQuery,
  useMaintenanceCheckQuery,
  useGetAdminPanelDataQuery,
} = appApi;
