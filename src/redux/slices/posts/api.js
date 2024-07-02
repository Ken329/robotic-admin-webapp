import { baseApiSlice } from "../../createAppApi";

export const postsApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllFiles: builder.query({
        query: () => ({
          url: "/file",
        }),
      }),
      getAllCategories: builder.query({
        query: () => ({
          url: "/blog/category",
        }),
      }),
      getAllBlogTypes: builder.query({
        query: () => ({
          url: "/blog/type",
        }),
      }),
      createPost: builder.mutation({
        query: ({
          title,
          category,
          description,
          type,
          assigned,
          coverImage,
          content,
        }) => ({
          url: `/blog`,
          method: "POST",
          body: {
            title: title,
            description: description,
            category: category,
            type: type,
            assigned: assigned,
            coverImage: coverImage,
            content: content,
          },
        }),
      }),
      updatePost: builder.mutation({
        query: ({
          id,
          title,
          category,
          description,
          type,
          assigned,
          coverImage,
          content,
        }) => ({
          url: `/blog/${id}`,
          method: "PUT",
          body: {
            title: title,
            description: description,
            category: category,
            type: type,
            assigned: assigned,
            coverImage: coverImage,
            content: content,
          },
        }),
      }),
      deletePost: builder.mutation({
        query: (id) => ({
          url: `/blog/${id}`,
          method: "DELETE",
        }),
      }),
      getPostById: builder.query({
        query: (id) => ({
          url: `/blog/${id}`,
        }),
      }),
      getAllBlogs: builder.query({
        query: () => ({
          url: "/blog",
        }),
      }),
      uploadFile: builder.mutation({
        query: (formdata) => ({
          url: "/file",
          method: "POST",
          body: formdata,
        }),
      }),
      deleteFile: builder.mutation({
        query: (id) => ({
          url: `/file/${id}`,
          method: "DELETE",
        }),
      }),
    };
  },
});

export const {
  useGetAllFilesQuery,
  useGetAllCategoriesQuery,
  useGetAllBlogTypesQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useGetAllBlogsQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} = postsApi;
