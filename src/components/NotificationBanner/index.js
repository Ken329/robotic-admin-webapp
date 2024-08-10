import React from "react";
import { Box, Text } from "@chakra-ui/react";

const NotificationBanner = () => {
  return (
    <Box
      overflow="hidden"
      position="relative"
      width="100%"
      height={{ base: "35px", md: "35px", lg: "50px" }}
      borderRadius="5px"
      bg="blue.400"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        whiteSpace="nowrap"
        animation="scroll 30s linear infinite"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text
          color="white"
          fontWeight="bold"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          mx={4}
        >
          🎉 Welcome to STEAM Cup+ Admin Portal! We have daily scheduled
          maintenance from 12 AM to 8 AM.
        </Text>
      </Box>

      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @media (max-width: 768px) {
            .chakra-box {
              animation-duration: 40s; // Slower on smaller screens
            }
          }

          @media (min-width: 1200px) {
            .chakra-box {
              animation-duration: 30s; // Faster on larger screens
            }
          }
        `}
      </style>
    </Box>
  );
};

export default NotificationBanner;
