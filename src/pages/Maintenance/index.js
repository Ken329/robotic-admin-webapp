import React from "react";
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { FaTools } from "react-icons/fa";

const Maintenance = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.100"
      textAlign="center"
      p={4}
    >
      <VStack spacing={6}>
        <Icon as={FaTools} boxSize={20} color="orange.500" />
        <Text fontSize="4xl" fontWeight="bold" color="gray.800">
          Maintenance Break
        </Text>
        <Text fontSize="lg" color="gray.600" maxWidth="500px">
          STEAM Cup+ is under daily maintenance from 10 PM to 6 AM. Please try
          again tomorrow.
        </Text>
      </VStack>
    </Box>
  );
};

export default Maintenance;
