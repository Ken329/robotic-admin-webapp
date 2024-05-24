import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../../redux/slices/app/selector";
import SteamCupLogoEdited from "../../../assets/images/STEAM Cup+edited.png";
import {
  Box,
  Flex,
  CloseButton,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { FiHome, FiUser } from "react-icons/fi";
import NavItem from "./NavItem";

const SidebarContent = ({ onClose, ...props }) => {
  const role = useSelector(makeSelectUserRole());

  const getLinkItems = (userRole) => {
    if (userRole === "admin") {
      return [
        { name: "Dashboard", icon: FiHome, path: "/dashboard" },
        { name: "Students", icon: FiUser, path: "/students" },
        { name: "Centres", icon: FiUser, path: "/centres" },
      ];
    } else if (userRole === "center") {
      return [
        { name: "Dashboard", icon: FiHome, path: "/dashboard" },
        { name: "Students", icon: FiUser, path: "/students" },
      ];
    } else {
      return [];
    }
  };

  const linkItems = getLinkItems(role);

  return (
    <Box
      transition="3s ease"
      bg={"#dde6ed"}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={SteamCupLogoEdited} alt="SteamCup Logo" maxH="12" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {linkItems.map((link, index) => (
        <NavItem key={index} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SidebarContent;
