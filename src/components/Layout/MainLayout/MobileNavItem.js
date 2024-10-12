import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  makeSelectUserRole,
  makeSelectUserName,
} from "../../../redux/slices/app/selector";
import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

const MobileNav = ({ onOpen, onLogout, ...props }) => {
  const location = useLocation();
  const role = useSelector(makeSelectUserRole());
  const userName = useSelector(makeSelectUserName());
  const storedUserName = localStorage.getItem("adminUserName");

  const displayName = useMemo(() => {
    if (userName && userName !== storedUserName) {
      localStorage.setItem("adminUserName", userName);
      return userName;
    }
    return storedUserName || userName;
  }, [userName, storedUserName]);

  const pageTitles = {
    "/admin/dashboard": "Admin Dashboard",
    "/admin/students": "Students",
    "/admin/centres": "Centres",
    "/admin/achievements": "Achievements",
  };

  const currentPage = pageTitles[location.pathname] || "";

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="14"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...props}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontWeight="bold"
        ml="8"
        color="#27374d"
      >
        {currentPage}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <HStack>
            <Box
              display={{ base: "none", md: "flex", lg: "flex" }}
              alignItems="center"
              bg={
                role === "admin"
                  ? "green.500"
                  : role === "center"
                  ? "blue.500"
                  : null
              }
              borderRadius="full"
              px="3"
              py="1"
            >
              <Text fontSize="sm" color="white">
                {role === "admin"
                  ? "Admin "
                  : role === "center"
                  ? "Centre "
                  : "User"}
                - {displayName}
              </Text>
            </Box>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size="sm"
                    name={displayName}
                    bg="orange.400"
                    color="white"
                  >
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <MenuItem onClick={onLogout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  );
};

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default MobileNav;
