import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllBlogsQuery,
  useDeletePostMutation,
} from "../../../redux/slices/posts/api";
import { saveBlogsData } from "../../../redux/slices/posts";
import { makeSelectUserRole } from "../../../redux/slices/app/selector";
import { makeSelectBlogsData } from "../../../redux/slices/posts/selector";
import useCustomToast from "../../../components/CustomToast";
import { USER_ROLE } from "../../../utils/constants";

const useDashboard = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const blogsData = useSelector(makeSelectBlogsData());

  const { data, isLoading, isError, refetch } = useGetAllBlogsQuery();
  const [deletePost] = useDeletePostMutation();

  const isAdmin = role === USER_ROLE.ADMIN;

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

  return { isLoading, blogsData, isAdmin, handleDelete };
};

export default useDashboard;
