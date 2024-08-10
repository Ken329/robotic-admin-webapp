import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Heading } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
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
import { USER_ROLE } from "../../utils/constants";
import NotificationBanner from "../../components/NotificationBanner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const navigate = useNavigate();
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

  const AdminPanel = () => (
    <Box
      m={{ base: "5%", md: "5%", lg: "2%" }}
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      mb={4}
    >
      <Heading as="h3" size="md" mb={4}>
        Admin Panel
      </Heading>
      <Button
        colorScheme="teal"
        variant="solid"
        size="sm"
        leftIcon={<FiPlus />}
        onClick={() => navigate("/admin/createPost")}
        flex="1"
      >
        New Post
      </Button>
    </Box>
  );

  return (
    <Layout isLoading={isLoading}>
      <NotificationBanner />
      {role === USER_ROLE.ADMIN && (
        <Box mb={4}>
          <AdminPanel />
        </Box>
      )}

      <BlogList blogs={blogsData} handleDelete={handleDelete} />
    </Layout>
  );
};
export default Dashboard;
