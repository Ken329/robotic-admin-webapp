import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGetStudentListQuery } from "../../redux/slices/students/api";
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
import useCustomToast from "../CustomToast";

const AdminPanel = ({ isAdmin }) => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, isLoading, isError } = useGetStudentListQuery();
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setStudentData(data?.data);
    } else if (isError) {
      toast({
        title: "Admin Panel",
        description: "Error getting student list",
        status: "error",
      });
    }
  }, [data, isLoading, isError]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const pendingAdmin = studentData["pending admin"];

  return (
    <>
      {isAdmin && (
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
              <StatCard
                label="Pending Admin Approvals"
                count={pendingAdmin || 0}
                fontSize={{ base: "sm", md: "md" }}
              />
              <StatCard
                label="Approved Students"
                count={studentData?.approved}
                fontSize={{ base: "sm", md: "md" }}
              />
              <StatCard
                label="Rejected Students"
                count={studentData?.rejected}
                fontSize={{ base: "sm", md: "md" }}
              />
            </SimpleGrid>

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
          </Collapse>
        </Box>
      )}
    </>
  );
};

AdminPanel.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

AdminPanel.defaultProps = {
  isAdmin: false,
};

export default AdminPanel;
