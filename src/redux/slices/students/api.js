import { baseApiSlice } from "../../createAppApi";

export const studentsApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getStudentList: builder.query({
        query: () => ({
          url: "/user/students",
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
      updateStudent: builder.mutation({
        query: ({ id, body }) => ({
          url: `/user/student/${id}`,
          method: "PUT",
          body: body,
        }),
      }),
      getStudentLevels: builder.query({
        query: () => ({
          url: "/level",
        }),
      }),
      createStudentLevel: builder.mutation({
        query: ({ name }) => ({
          url: `/level`,
          method: "POST",
          body: {
            name,
          },
        }),
      }),
      deleteStudentLevel: builder.mutation({
        query: (id) => ({
          url: `/level/${id}`,
          method: "DELETE",
        }),
      }),
    };
  },
});

export const {
  useGetStudentListQuery,
  useApproveStudentMutation,
  useRejectStudentMutation,
  useUpdateStudentMutation,
  useGetStudentLevelsQuery,
  useCreateStudentLevelMutation,
  useDeleteStudentLevelMutation,
} = studentsApi;
