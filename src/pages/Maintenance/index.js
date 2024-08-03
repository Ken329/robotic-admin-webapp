import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { FaTools } from "react-icons/fa";
import { useMaintenanceCheckQuery } from "../../redux/slices/app/api";

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
        <Icon as={FaTools} boxSize={20} color="orange.500" />
        <Text fontSize="4xl" fontWeight="bold" color="gray.800">
          Maintenance Break
        </Text>
        <Text fontSize="lg" color="gray.600" maxWidth="500px">
          STEAM Cup+ is under daily maintenance from{" "}
          {maintenanceTime?.startTime || "N/A"} to{" "}
          {maintenanceTime?.endTime || "N/A"}. Please try again tomorrow.
        </Text>
      </VStack>
    </Box>
  );
};

export default Maintenance;
