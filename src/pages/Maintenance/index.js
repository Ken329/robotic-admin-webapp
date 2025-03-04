import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, VStack, Icon, Image } from "@chakra-ui/react";
import { FaTools } from "react-icons/fa";
import { useMaintenanceCheckQuery } from "../../redux/slices/app/api";
import SteamCupLogo from "../../assets/images/STEAM Cup+.webp";

const Maintenance = () => {
  const navigate = useNavigate();
  const [maintenanceTime, setMaintenanceTime] = useState({});
  const {
    data: maintenanceData,
    isLoading: maintenanceIsLoading,
    isError: maintenanceIsError,
  } = useMaintenanceCheckQuery();

  useEffect(() => {
    if (
      !maintenanceIsLoading &&
      !maintenanceIsError &&
      maintenanceData?.data === null
    ) {
      navigate("/admin/login");
    } else {
      setMaintenanceTime(maintenanceData?.data);
    }
  }, [maintenanceData, maintenanceIsLoading, maintenanceIsError]);

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
        <Image src={SteamCupLogo} alt="SteamCup Logo" maxH="200px" />
        <Flex alignItems="center" gap={2}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            Maintenance Break
          </Text>
          <Icon as={FaTools} color="orange.500" boxSize={8} />
        </Flex>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          maxWidth="500px"
        >
          STEAM Cup+ is under daily maintenance from 22:00 PM to{" "}
          {maintenanceTime?.endTime || "N/A"}. Please try again tomorrow.
        </Text>
      </VStack>
    </Box>
  );
};

export default Maintenance;
