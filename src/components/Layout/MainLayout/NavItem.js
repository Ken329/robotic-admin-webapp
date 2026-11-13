import React, { memo } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const NavItem = ({ icon, path, children }) => {
  return (
    <Box
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: '#27374d',
          color: '#dde6ed'
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: '#27374d'
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

NavItem.propTypes = {
  icon: PropTypes.any,
  path: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

export default memo(NavItem);
