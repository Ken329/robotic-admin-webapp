import React, { useEffect, useState } from 'react';

import { Flex, Spinner } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { saveToken } from '@redux/slices/app';
import userpool from '@utils/userpool';
import Layout from '@components/Layout/MainLayout';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  const user = userpool.getCurrentUser();
  const authTokens = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (user && authTokens?.accessToken) {
      dispatch(saveToken(authTokens?.accessToken));
      setIsReady(true);
    } else {
      navigate('/admin/logout', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authTokens]);

  if (!isReady) {
    return (
      <Layout>
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="10"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
        </Flex>
      </Layout>
    );
  }

  if (isReady) {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  return null;
};

export default PrivateRoute;
