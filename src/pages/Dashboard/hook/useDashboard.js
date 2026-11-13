import { useCallback, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { selectUserRole } from '@redux/slices/app/selector';
import { useDeletePostMutation, useGetAllBlogsQuery } from '@redux/slices/posts/api';
import { EMPTY_ARRAY, USER_ROLE } from '@utils/constants';
import useCustomToast from '@components/CustomToast';

const useDashboard = () => {
  const toast = useCustomToast();
  const role = useSelector(selectUserRole);

  const { data, isLoading, isError, refetch } = useGetAllBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const blogsData = data?.data ?? EMPTY_ARRAY;
  const [deletePost] = useDeletePostMutation();

  const isAdmin = role === USER_ROLE.ADMIN;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Dashboard',
        description: 'Error getting blogs list',
        status: 'error'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const handleDelete = useCallback(
    async id => {
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
    },
    [deletePost, refetch, toast]
  );

  return { isLoading, blogsData, isAdmin, handleDelete };
};

export default useDashboard;
