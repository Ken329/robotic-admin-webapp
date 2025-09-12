import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { saveToken } from '@redux/slices/app';
import userpool from '@utils/userpool';
import Layout from '@components/Layout/MainLayout';
import Spin from '@components/Spin';

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
        <Spin />
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
