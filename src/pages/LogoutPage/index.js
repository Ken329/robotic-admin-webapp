import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { resetApp } from '@redux/slices/app';
import { appApi } from '@redux/slices/app/api';
import { makeSelectToken } from '@redux/slices/app/selector';
import { logout } from '@services/auth';
import userpool from '@utils/userpool';
import Spin from '@components/Spin';

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const hasLoggedOut = useRef(false);

  const user = userpool.getCurrentUser();
  const token = useSelector(makeSelectToken());

  const handleLogout = async () => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    if (user) {
      user.signOut();
    }

    await logout(token);
    dispatch(appApi.util.resetApiState());
    dispatch(resetApp());
    setIsLoading(false);
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    if (token) {
      handleLogout();
    } else {
      navigate('/admin/login', {
        replace: true,
        state: { unauthorized: location?.state?.unauthorized ? true : false }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, location]);

  return isLoading ? <Spin /> : null;
};

export default LogoutPage;
