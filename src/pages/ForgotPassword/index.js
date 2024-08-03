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
  Spinner,
  InputGroup,
  InputRightElement,
  Link,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Formik, Field } from "formik";
import { forgotPassword, resetPasswordWithOTP } from "../../services/awsAuth";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../utils/validationSchema";
import { useMaintenanceCheckQuery } from "../../redux/slices/app/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const {
    data: maintenanceData,
    isLoading: maintenanceIsLoading,
    isError: maintenanceIsError,
  } = useMaintenanceCheckQuery();

  useEffect(() => {
    if (
      !maintenanceIsLoading &&
      !maintenanceIsError &&
      maintenanceData?.data !== null
    ) {
      navigate("/admin/maintenance");
    }
  }, [maintenanceData, maintenanceIsLoading, maintenanceIsError]);

  const handleForgotPassword = ({ email }) => {
    setError(null);
    setCurrentEmail(email);
    setLoading(true);
    forgotPassword(email)
      .then(() => {
        setStep(2);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResetPassword = ({ newPassword, otp }) => {
    setError(null);
    setLoading(true);
    resetPasswordWithOTP(currentEmail, newPassword, otp)
      .then(() => {
        navigate("/admin/login");
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
          Forgot Password
        </Text>
      </Flex>
      {error && (
        <Alert marginBottom={5} status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      )}
      {step && step === 1 && (
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={(values) => {
            handleForgotPassword(values);
          }}
          validationSchema={forgotPasswordSchema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <Text fontSize="14px" fontWeight="500">
                  Please enter your login email below and we&apos;ll send you a
                  verification code to reset your password.
                </Text>

                <FormControl isInvalid={errors.email && touched.email} w="100%">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    variant="filled"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  {loading ? <Spinner size="sm" color="white" /> : "Submit"}
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      )}
      {step && step === 2 && (
        <Formik
          initialValues={{
            newPassword: "",
            otp: "",
          }}
          onSubmit={(values) => {
            handleResetPassword(values);
          }}
          validationSchema={resetPasswordSchema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <Text fontSize="14px" fontWeight="500">
                  Enter your new password and verification otp sent to your
                  email.
                </Text>

                <FormControl
                  isInvalid={errors.newPassword && touched.newPassword}
                  w="100%"
                >
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={Input}
                      id="newPassword"
                      name="newPassword"
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
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.otp && touched.otp} w="100%">
                  <FormLabel htmlFor="otp">Verification OTP</FormLabel>
                  <Field
                    as={Input}
                    id="otp"
                    name="otp"
                    type="text"
                    variant="filled"
                  />
                  <FormErrorMessage>{errors.otp}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  {loading ? <Spinner size="sm" color="white" /> : "Submit"}
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      )}
      <Flex justifyContent="center" alignItems="center" w="100%" mt={"15px"}>
        <ArrowBackIcon mr={1} color={"blue.500"} />
        <Link href="/admin/login" color={"blue.500"}>
          Back to Login
        </Link>
      </Flex>
    </Box>
  );
};

export default ForgotPassword;
