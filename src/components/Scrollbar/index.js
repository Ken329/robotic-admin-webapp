import React from 'react';

import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { scrollbarStyles } from '@components/Scrollbar/views';

const Scrollbar = ({ children, ...props }) => {
  return (
    <Box
      height="calc(100vh - 56px)" // 56px is the height of the MobileNav header
      overflowY="auto"
      css={scrollbarStyles}
      {...props}
    >
      {children}
    </Box>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default Scrollbar;
