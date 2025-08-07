import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import useCustomToast from '../../../components/CustomToast';
import { makeSelectUserRole } from '../../../redux/slices/app/selector';
import { saveBlogsData } from '../../../redux/slices/posts';
import { useDeletePostMutation, useGetAllBlogsQuery } from '../../../redux/slices/posts/api';
import { makeSelectBlogsData } from '../../../redux/slices/posts/selector';
import { USER_ROLE } from '../../../utils/constants';

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
        title: 'Dashboard',
        description: 'Error getting blogs list',
        status: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async id => {
    try {
      await deletePost(id).unwrap();
      toast({
        title: 'Dashboard',
        description: 'The blog post has been deleted successfully.',
        status: 'success'
      });
    } catch (error) {
      toast({
        title: 'Dashboard',
        description: 'There was an error deleting the blog post.',
        status: 'error'
      });
    } finally {
      refetch();
    }
  };

  return { isLoading, blogsData, isAdmin, handleDelete };
};

export default useDashboard;
