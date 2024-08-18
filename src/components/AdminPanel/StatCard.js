import React from "react";
import PropTypes from "prop-types";
import { Stat, StatLabel, StatNumber, Box } from "@chakra-ui/react";

const StatCard = ({ label, count }) => (
  <Box
    p={{ base: 3, md: 4 }}
    bg="gray.100"
    borderRadius="md"
    boxShadow={{ base: "sm", md: "md" }}
  >
    <Stat>
      <StatLabel fontSize={{ base: "md", md: "lg" }} color="black" mb={2}>
        {label}
      </StatLabel>
      <StatNumber fontSize={{ base: "xl", md: "2xl" }} color="black">
        {count}
      </StatNumber>
    </Stat>
  </Box>
);

StatCard.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number,
};

export default StatCard;
