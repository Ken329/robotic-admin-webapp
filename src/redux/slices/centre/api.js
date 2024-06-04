import { baseApiSlice } from "../../createAppApi";

export const centresApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getCentresList: builder.query({
        query: () => ({
          url: "/user/centers",
        }),
      }),
      createCentre: builder.mutation({
        query: (payload) => ({
          url: `/user/center`,
          method: "POST",
          body: payload,
        }),
      }),
    };
  },
});

export const { useGetCentresListQuery, useCreateCentreMutation } = centresApi;
