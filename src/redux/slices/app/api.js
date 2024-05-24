import { baseApiSlice } from "../../createAppApi";

export const appApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserData: builder.query({
        query: () => ({
          url: "/user",
        }),
      }),
      getStudentList: builder.query({
        query: () => ({
          url: "/user/students",
        }),
      }),
      getCentresList: builder.query({
        query: () => ({
          url: "/user/centers",
        }),
      }),
      approveStudent: builder.mutation({
        query: ({ id, body }) => ({
          url: `/user/${id}/approve`,
          method: "POST",
          body: body,
        }),
      }),
      rejectStudent: builder.mutation({
        query: ({ id }) => ({
          url: `/user/${id}/reject`,
          method: "POST",
        }),
      }),
    };
  },
});

export const {
  useGetCentresListQuery,
  useGetUserDataQuery,
  useGetStudentListQuery,
  useApproveStudentMutation,
  useRejectStudentMutation,
} = appApi;
