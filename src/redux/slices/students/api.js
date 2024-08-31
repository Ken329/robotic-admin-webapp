import { baseApiSlice } from "../../createAppApi";

export const studentsApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getStudentList: builder.query({
        query: ({ page = 1, limit = 10, status, name }) => {
          const queryParams = {
            ...(page && { page }),
            ...(limit && { limit }),
            ...(status && { status }),
            ...(name && { name }),
          };

          const params = new URLSearchParams(queryParams).toString();

          const url = params ? `/user/students?${params}` : "/user/students";

          return {
            url,
          };
        },
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
      deleteStudent: builder.mutation({
        query: (id) => ({
          url: `/user/student/${id}`,
          method: "DELETE",
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
  useDeleteStudentMutation,
  useGetStudentLevelsQuery,
  useCreateStudentLevelMutation,
  useDeleteStudentLevelMutation,
} = studentsApi;
