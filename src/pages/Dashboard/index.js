import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllBlogsQuery,
  useDeletePostMutation,
} from "../../redux/slices/posts/api";
import { saveBlogsData } from "../../redux/slices/posts";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
import { makeSelectBlogsData } from "../../redux/slices/posts/selector";
import Layout from "../../components/Layout/MainLayout";
import useCustomToast from "../../components/CustomToast";
import BlogList from "../../components/BlogPosts";
import NotificationBanner from "../../components/NotificationBanner";
import AdminPanel from "../../components/AdminPanel";
import { USER_ROLE } from "../../utils/constants";

const Dashboard = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const blogsData = useSelector(makeSelectBlogsData());
  const { data, isLoading, isError, refetch } = useGetAllBlogsQuery();
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(saveBlogsData(data?.data));
    } else if (isError) {
      toast({
        title: "Dashboard",
        description: "Error getting blogs list",
        status: "error",
      });
    }
  }, [data, isLoading, isError, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap();
      toast({
        title: "Dashboard",
        description: "The blog post has been deleted successfully.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Dashboard",
        description: "There was an error deleting the blog post.",
        status: "error",
      });
    } finally {
      refetch();
    }
  };

  return (
    <Layout isLoading={isLoading}>
      <NotificationBanner />
      <AdminPanel isAdmin={role === USER_ROLE.ADMIN} />
      <BlogList blogs={blogsData} handleDelete={handleDelete} />
    </Layout>
  );
};

export default Dashboard;
