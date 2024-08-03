/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SteamCupLogo from "../../assets/images/STEAM Cup+.png";
import {
  Flex,
  Text,
  VStack,
  FormLabel,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Spinner,
  Box,
  Image,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import { verifySchema, emailSchema } from "../../utils/validationSchema";
import { verifyOtp } from "../../services/auth";
import { resendVerificationOtp } from "../../services/awsAuth";
import useCustomToast from "../../components/CustomToast";
import { useMaintenanceCheckQuery } from "../../redux/slices/app/api";

const Verify = () => {
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
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

  const handleSendVerificationCode = async (values, actions) => {
    setError(null);
    setLoading(true);
    try {
      await resendVerificationOtp(values.email);
      setEmail(values.email);
      setStep(2);
      setLoading(false);
      toast({
        title: "Verification",
        description: "Verification code sent to your email.",
        status: "success",
      });
    } catch (error) {
      setLoading(false);
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const handleVerify = async (values, actions) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        email: email,
        code: values.code,
      };

      const response = await verifyOtp(payload);
      if (response?.success) {
        setLoading(false);
        actions.resetForm();
        navigate("/admin/login");
        toast({
          title: "Verification",
          description: "Account email verification successful",
          status: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: (values, actions) => {
      handleSendVerificationCode(values, actions);
    },
  });

  const verifyOTPFormik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: verifySchema,
    onSubmit: (values, actions) => {
      handleVerify(values, actions);
    },
  });

  return (
    <Box bg="white" p={6} rounded="md" w={80} alignItems="center">
      <Flex align="center" justify="center" p="10px">
        <Image src={SteamCupLogo} alt="SteamCup Logo" width={36} />
      </Flex>
      <Flex align="center" justify="center" p="10px">
        <Text fontSize="24px" fontWeight="500">
          Email Verification
        </Text>
      </Flex>
      {error && (
        <Alert marginBottom={5} status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      )}

      {step === 1 ? (
        <VStack
          as="form"
          mx="auto"
          w="100%"
          spacing={4}
          justifyContent="center"
          onSubmit={emailFormik.handleSubmit}
        >
          <Text fontSize="14px" fontWeight="500">
            Enter your email to receive the verification code.
          </Text>
          <FormControl
            isInvalid={emailFormik.errors.email && emailFormik.touched.email}
          >
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              placeholder="Email"
              {...emailFormik.getFieldProps("email")}
            />
            <FormErrorMessage>{emailFormik.errors.email}</FormErrorMessage>
          </FormControl>

          <Flex>
            <Button type="submit" colorScheme="blue" w="full">
              {loading ? <Spinner size="sm" color="white" /> : "Submit"}
            </Button>
          </Flex>
        </VStack>
      ) : (
        <VStack
          as="form"
          mx="auto"
          w="100%"
          spacing={4}
          justifyContent="center"
          onSubmit={verifyOTPFormik.handleSubmit}
        >
          <Text fontSize="14px" fontWeight="500">
            Enter the verification OTP sent to your email.
          </Text>
          <FormControl
            isInvalid={
              verifyOTPFormik.errors.code && verifyOTPFormik.touched.code
            }
          >
            <FormLabel>Verification OTP</FormLabel>
            <Input
              name="code"
              placeholder="6 digit OTP code"
              {...verifyOTPFormik.getFieldProps("code")}
            />
            <FormErrorMessage>{verifyOTPFormik.errors.code}</FormErrorMessage>
          </FormControl>

          <Flex>
            <Button type="submit" colorScheme="blue" w="full">
              {loading ? <Spinner size="sm" color="white" /> : "Submit"}
            </Button>
          </Flex>
        </VStack>
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

export default Verify;
