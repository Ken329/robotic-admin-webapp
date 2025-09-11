import React, { useMemo } from 'react';

import { Box, CloseButton, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FiAward, FiHome, FiMonitor, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import NavItem from '@components/Layout/MainLayout/NavItem';
import { makeSelectUserRole } from '@redux/slices/app/selector';
import SteamCupLogoEdited from '@assets/images/STEAM Cup+edited.webp';

const SidebarContent = ({ onClose, ...props }) => {
  const useUserRole = () => {
    const role = useSelector(makeSelectUserRole());
    const userRole = useMemo(() => {
      const storedRole = localStorage.getItem('adminUserRole');

      if (role && role !== storedRole) {
        localStorage.setItem('adminUserRole', role);

        return role;
      }

      return storedRole || role;
    }, [role]);

    return userRole;
  };

  const useLinkItems = () => {
    const userRole = useUserRole();

    const linkItems = useMemo(() => {
      switch (userRole) {
        case 'admin':
          return [
            { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
            { name: 'Students', icon: FiUser, path: '/admin/students' },
            { name: 'Centres', icon: FiMonitor, path: '/admin/centres' },
            {
              name: 'Achievements',
              icon: FiAward,
              path: '/admin/achievements'
            }
          ];
        case 'center':
          return [
            { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
            { name: 'Students', icon: FiUser, path: '/admin/students' }
          ];
        default:
          return [];
      }
    }, [userRole]);

    return linkItems;
  };

  const linkItems = useLinkItems();

  return (
    <Box
      transition="3s ease"
      bg={'#dde6ed'}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={SteamCupLogoEdited} alt="SteamCup Logo" maxH="12" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {linkItems.map((link, index) => (
        <NavItem key={index} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default SidebarContent;
