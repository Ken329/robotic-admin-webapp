import React from 'react';

import { Box, useBreakpointValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { scrollbarStyles } from '@components/Scrollbar/views';

const Scrollbar = ({ children, ...props }) => {
  const useScrollbar = useBreakpointValue({ base: false, md: true });

  return (
    <Box height="100%" overflowY="auto" css={useScrollbar ? scrollbarStyles : undefined} {...props}>
      {children}
    </Box>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default Scrollbar;
