/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SteamCupLogo from "../../assets/images/STEAM Cup+.png";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
  Flex,
  Alert,
  AlertIcon,
  Image,
  Spinner,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Formik, Field } from "formik";
import { authenticate } from "../../services/awsAuth";
import userpool from "../../utils/userpool";
import { loginSchema } from "../../utils/validationSchema";
import { generateAccessToken } from "../../services/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const authTokens = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const user = userpool.getCurrentUser();
    if (user && authTokens?.accessToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [userpool, authTokens]);

  const initAuth = async (cognitoToken) => {
    const tokenPayload = await generateAccessToken(cognitoToken);
    if (tokenPayload) {
      localStorage.setItem("token", JSON.stringify(tokenPayload));
      setLoading(false);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/logout", { replace: true });
    }
  };

  const handleLogin = ({ email, password }) => {
    setError(null);
    setLoading(true);
    authenticate(email, password)
      .then((userSession) => {
        const cognitoToken = userSession.getAccessToken().getJwtToken();
        initAuth(cognitoToken);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box bg="white" p={6} rounded="md" w={80} alignItems="center">
      <Flex align="center" justify="center" p="10px">
        <Image src={SteamCupLogo} alt="SteamCup Logo" width={36} />
      </Flex>
      <Flex align="center" justify="center" p="10px">
        <Text fontSize="24px" fontWeight="500">
          Admin Portal Login
        </Text>
      </Flex>
      {error && (
        <Alert marginBottom={5} status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values) => handleLogin(values)}
        validationSchema={loginSchema}
      >
        {({ handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
              <FormControl isInvalid={errors.email && touched.email} w="100%">
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.password && touched.password}
                w="100%"
              >
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="filled"
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                {loading ? <Spinner size="sm" color="white" /> : "Login"}
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
      <Flex justifyContent="center" w="100%" mt={"15px"}>
        <Link href="/forgot-password" color={"blue.500"}>
          Forgot Password?
        </Link>
      </Flex>
    </Box>
  );
};

export default LoginPage;
