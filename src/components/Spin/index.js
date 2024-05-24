import React from "react";
import { Spinner, Flex } from "@chakra-ui/react";

const Spin = () => (
  <Flex
    position="absolute"
    top="50%"
    left="50%"
    transform="translate(-50%, -50%)"
    zIndex="10"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
  </Flex>
);

export default Spin;
