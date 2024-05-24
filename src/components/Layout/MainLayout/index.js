import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useGetUserDataQuery } from "../../../redux/slices/app/api";
import { saveUserData } from "../../../redux/slices/app";
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
} from "@chakra-ui/react";
import SidebarContent from "./SideBarContent";
import MobileNav from "./MobileNavItem";
import Spin from "../../Spin";
import AnimatedPage from "../../AnimatedPage";

const Layout = ({ children, isLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading: isUserLoading, isError } = useGetUserDataQuery();

  useEffect(() => {
    if (!isUserLoading && !isError && data) {
      dispatch(saveUserData(data?.data));
    } else if (isError) {
      onLogout();
    }
  }, [data, isUserLoading, isError, dispatch]);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const onLogout = () => {
    navigate("/logout");
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} onLogout={onLogout} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {isLoading ? <Spin /> : <AnimatedPage>{children}</AnimatedPage>}
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.any.isRequired,
  isLoading: PropTypes.bool,
};

Layout.defaultProps = {
  isLoading: false,
};

export default Layout;
