import React from 'react';

import PropTypes from 'prop-types';

import Spin from '@components/Spin';

const PageLayout = ({ children, isLoading }) => {
  return <>{isLoading ? <Spin /> : children}</>;
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool
};

PageLayout.defaultProps = {
  isLoading: false
};

export default PageLayout;
