import React, { useEffect, useState } from 'react';

import { Box, Drawer, DrawerContent, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { saveUserData } from '@redux/slices/app';
import { useGetUserDataQuery } from '@redux/slices/app/api';
import AnimatedPage from '@components/AnimatedPage';
import MobileNav from '@components/Layout/MainLayout/MobileNavItem';
import SidebarContent from '@components/Layout/MainLayout/SideBarContent';
import Scrollbar from '@components/Scrollbar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading: isUserLoading, isError } = useGetUserDataQuery();

  useEffect(() => {
    if (!isUserLoading && !isError && data) {
      const role = data?.data?.role;

      if (role === 'student') {
        navigate('/admin/logout', {
          replace: true,
          state: { unauthorized: true }
        });
      }
      dispatch(saveUserData(data?.data));
    } else if (isError) {
      onLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isUserLoading, isError, dispatch]);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const onLogout = () => {
    navigate('/admin/logout');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} onLogout={onLogout} />
      <Box
        ml={{ base: 0, md: 60 }}
        position="relative"
        height={{
          base: 'calc(100dvh - 56px)', // dynamic viewport height for mobile
          md: 'calc(100vh - 56px)' // regular viewport height for desktop
        }}
      >
        <Scrollbar p="4">
          <AnimatedPage>{children}</AnimatedPage>
        </Scrollbar>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.any.isRequired
};

Layout.defaultProps = {
  isLoading: false
};

export default Layout;
