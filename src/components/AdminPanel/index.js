import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Collapse,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FiPlus, FiChevronUp, FiChevronDown } from "react-icons/fi";
import StatCard from "./StatCard";

const AdminPanel = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [studentData] = useState({
    pendingAdmin: 0,
    pendingCenter: 0,
    approved: 0,
    rejected: 0,
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      m={{ base: "3%", md: "5%", lg: "2%" }}
      p={{ base: 3, md: 4 }}
      bg="#27374d"
      color="white"
      borderRadius="md"
      boxShadow="sm"
      mb={4}
    >
      <Flex justify="space-between" align="center" mb={{ base: 3, md: 4 }}>
        <Heading as="h3" size={{ base: "sm", md: "md" }}>
          Admin Panel
        </Heading>
        <IconButton
          size="sm"
          onClick={toggleCollapse}
          icon={isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
          aria-label="Toggle Collapse"
        />
      </Flex>

      <Collapse in={!isCollapsed}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 2, md: 4 }}
          mb={4}
        >
          {isAdmin ? (
            <StatCard
              label="Pending Admin Approvals"
              count={studentData?.pendingAdmin || 0}
              fontSize={{ base: "sm", md: "md" }}
            />
          ) : (
            <StatCard
              label="Pending Centre Approvals"
              count={studentData?.pendingCenter || 0}
              fontSize={{ base: "sm", md: "md" }}
            />
          )}
          <StatCard
            label="Approved Students"
            count={studentData?.approved || 0}
            fontSize={{ base: "sm", md: "md" }}
          />
          <StatCard
            label="Rejected Students"
            count={studentData?.rejected || 0}
            fontSize={{ base: "sm", md: "md" }}
          />
        </SimpleGrid>

        {isAdmin && (
          <Button
            colorScheme="teal"
            variant="solid"
            size={{ base: "sm", md: "md" }}
            leftIcon={<FiPlus />}
            onClick={() => navigate("/admin/createPost")}
            flex="1"
          >
            New Post
          </Button>
        )}
      </Collapse>
    </Box>
  );
};

AdminPanel.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

AdminPanel.defaultProps = {
  isAdmin: false,
};

export default AdminPanel;
