import { baseApiSlice } from "../../createAppApi";

export const achievementsApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAchievementList: builder.query({
        query: () => ({
          url: "/achievements",
        }),
      }),
      getAchievementImage: builder.query({
        query: (url) => ({
          url: url,
          responseType: "blob",
        }),
      }),
      createAchievement: builder.mutation({
        query: ({ formData }) => ({
          url: `/achievement`,
          method: "POST",
          body: formData,
        }),
      }),
      deleteAchievement: builder.mutation({
        query: (id) => ({
          url: `/achievement/${id}`,
          method: "DELETE",
        }),
      }),
      updateAchievement: builder.mutation({
        query: ({ title, description, id }) => ({
          url: `/achievement/${id}`,
          method: "PUT",
          body: {
            title: title,
            description: description,
          },
        }),
      }),
      assignAchievement: builder.mutation({
        query: ({ id, achievementIds }) => ({
          url: `/achievement/assign/${id}`,
          method: "PUT",
          body: {
            achievementIds: achievementIds,
          },
        }),
      }),
      getAssignedAchievements: builder.query({
        query: (id) => ({
          url: `/achievement/assign/${id}`,
        }),
      }),
    };
  },
});

export const {
  useGetAchievementListQuery,
  useGetAchievementImageQuery,
  useCreateAchievementMutation,
  useDeleteAchievementMutation,
  useUpdateAchievementMutation,
  useAssignAchievementMutation,
  useGetAssignedAchievementsQuery,
} = achievementsApi;
