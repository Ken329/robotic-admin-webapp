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
      updateCentre: builder.mutation({
        query: ({ id, body }) => ({
          url: `/center/${id}`,
          method: "PUT",
          body: body,
        }),
      }),
    };
  },
});

export const {
  useGetCentresListQuery,
  useCreateCentreMutation,
  useUpdateCentreMutation,
} = centresApi;
