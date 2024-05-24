import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import userpool from "../../utils/userpool";
import Layout from "../Layout/MainLayout";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  const authTokens = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const user = userpool.getCurrentUser();
    const authTokens = JSON.parse(localStorage.getItem("token"));
    if (user && authTokens?.accessToken) {
      setIsReady(true);
    } else {
      navigate("/logout", { replace: true });
    }
  }, [authTokens]);

  if (!isReady) {
    return (
      <Layout>
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="10"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
        </Flex>
      </Layout>
    );
  }

  if (isReady) {
    return <Outlet />;
  }

  return null;
};
export default PrivateRoute;
