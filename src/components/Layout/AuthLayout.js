import React from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const AuthLayout = () => {
  return (
    <Flex
      bg="gray.100"
      align="center"
      justify="center"
      minHeight="100vh"
      padding={4}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        maxW="400px"
        w="100%"
      >
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
