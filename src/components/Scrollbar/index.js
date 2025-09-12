import React from 'react';

import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { scrollbarStyles } from '@components/Scrollbar/views';

const Scrollbar = ({ children, ...props }) => {
  return (
    <Box height="100vh" overflowY="auto" css={scrollbarStyles} {...props}>
      {children}
    </Box>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default Scrollbar;
