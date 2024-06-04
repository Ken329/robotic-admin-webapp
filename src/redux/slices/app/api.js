import { baseApiSlice } from "../../createAppApi";

export const appApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserData: builder.query({
        query: () => ({
          url: "/user",
        }),
      }),
    };
  },
});

export const { useGetUserDataQuery } = appApi;
