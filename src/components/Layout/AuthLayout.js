import React, { Suspense } from 'react';

import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Spin from '@components/Spin';

const AuthLayout = () => {
  return (
    <Flex bg="gray.100" align="center" justify="center" minHeight="100vh" padding={4}>
      <Flex direction="column" align="center" justify="center" maxW="400px" w="100%">
        <Suspense fallback={<Spin />}>
          <Outlet />
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
