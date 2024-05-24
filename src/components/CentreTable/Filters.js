import React, { useState } from "react";
import { toast } from "react-toastify";
import NodeRSA from "node-rsa";
import PropTypes from "prop-types";
import {
  HStack,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Stack,
  Flex,
  VStack,
  Spinner,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import { FiSearch, FiPlus } from "react-icons/fi";
import { createCentreSchema, verifySchema } from "../../utils/validationSchema";
import {
  generatePublicKey,
  createCentreAccount,
  verifyOtp,
} from "../../services/auth";

const Filters = ({ columnFilters, setColumnFilters, refetch }) => {
  const taskName =
    columnFilters.find((f) => f.id === "centerName")?.value || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centreId, setCentreId] = useState("");
  const [isVerify, setIsVerify] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  const performRSAEncryption = async (payload, actions) => {
    try {
      const publicKey = await generatePublicKey();
      if (publicKey) {
        const key = new NodeRSA(publicKey);
        const encryptedPassword = key.encrypt(payload, "base64");
        return encryptedPassword;
      }
    } catch (error) {
      setLoading(false);
      actions.resetForm();
      toast.error(error);
    }
  };

  const handleCreateNewCentre = async (values, actions) => {
    setLoading(true);
    try {
      const encryptedPassword = await performRSAEncryption(
        values.password,
        actions
      );

      if (encryptedPassword) {
        const updatedValues = {
          ...values,
          password: encryptedPassword,
        };
        const response = await createCentreAccount(
          updatedValues,
          token?.accessToken
        );
        if (response?.success) {
          setCentreId(response?.data?.id);
          setLoading(false);
          setIsVerify(true);
          actions.resetForm();
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error);
      actions.resetForm();
    }
  };

  const handleVerify = async (values, actions) => {
    setLoading(true);
    try {
      const payload = {
        id: centreId,
        code: values.code,
      };

      const response = await verifyOtp(payload);
      if (response?.success) {
        setLoading(false);
        toast.success("Sucessfully registered account!");
        refetch();
        closeModal();
        actions.resetForm();
        setIsVerify(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error);
      actions.resetForm();
    }
  };

  const createCentreFormik = useFormik({
    initialValues: {
      name: "",
      location: "",
      email: "",
      password: "",
    },
    validationSchema: createCentreSchema,
    onSubmit: (values, actions) => {
      handleCreateNewCentre(values, actions);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    createCentreFormik.resetForm();
    verifyOTPFormik.resetForm();
  };

  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  return (
    <HStack mb={6} spacing={3}>
      <InputGroup size={"sm"} maxW={"12rem"}>
        <InputLeftElement pointerEvents={"none"}>
          <Icon as={FiSearch} />
        </InputLeftElement>
        <Input
          type="text"
          variant={"filled"}
          placeholder="search centre"
          borderWidth={1.5}
          borderColor="grey"
          value={taskName}
          onChange={(e) => onFilterChange("centerName", e.target.value)}
        />
      </InputGroup>
      <Button
        colorScheme="teal"
        variant="solid"
        size="sm"
        leftIcon={<FiPlus />}
        onClick={openModal}
      >
        New Centre
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex minH={"50vh"} justify={"center"} borderRadius={"xl"}>
              <Stack spacing={4} w={"100%"} p={6}>
                <Heading lineHeight={1.1} fontSize={{ base: "xl", sm: "2xl" }}>
                  Create New Centre
                </Heading>
                {isVerify ? (
                  <VStack
                    as="form"
                    mx="auto"
                    w="100%"
                    spacing={4}
                    justifyContent="center"
                    onSubmit={verifyOTPFormik.handleSubmit}
                  >
                    <Text
                      fontSize="14px"
                      fontWeight="500"
                      alignSelf="flex-start"
                    >
                      Enter the verification otp sent to the registered email.
                    </Text>
                    <FormControl
                      isInvalid={
                        verifyOTPFormik.errors.code &&
                        verifyOTPFormik.touched.code
                      }
                    >
                      <FormLabel>Verification OTP</FormLabel>
                      <Input
                        name="code"
                        placeholder="6 digit OTP code"
                        {...verifyOTPFormik.getFieldProps("code")}
                      ></Input>
                      <FormErrorMessage>
                        {verifyOTPFormik.errors.code}
                      </FormErrorMessage>
                    </FormControl>

                    <Flex>
                      <Button type="submit" colorScheme="green">
                        {loading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Submit"
                        )}
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
                    onSubmit={createCentreFormik.handleSubmit}
                  >
                    <FormControl
                      isInvalid={
                        createCentreFormik.errors.name &&
                        createCentreFormik.touched.name
                      }
                    >
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        placeholder="Centre Name"
                        {...createCentreFormik.getFieldProps("name")}
                      ></Input>
                      <FormErrorMessage>
                        {createCentreFormik.errors.name}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        createCentreFormik.errors.location &&
                        createCentreFormik.touched.location
                      }
                    >
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        placeholder="Centre Location"
                        {...createCentreFormik.getFieldProps("location")}
                      ></Input>
                      <FormErrorMessage>
                        {createCentreFormik.errors.location}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        createCentreFormik.errors.email &&
                        createCentreFormik.touched.email
                      }
                    >
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        placeholder="Centre Email Address"
                        {...createCentreFormik.getFieldProps("email")}
                      ></Input>
                      <FormErrorMessage>
                        {createCentreFormik.errors.email}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        createCentreFormik.errors.password &&
                        createCentreFormik.touched.password
                      }
                    >
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          placeholder="Centre Password"
                          {...createCentreFormik.getFieldProps("password")}
                          style={{
                            WebkitTextSecurity: showPassword ? "none" : "disc", // Conditionally mask the text
                          }}
                        />
                        <InputRightElement>
                          <Button
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {createCentreFormik.errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <Flex>
                      <Button type="submit" colorScheme="green">
                        {loading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Flex>
                  </VStack>
                )}
              </Stack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

Filters.propTypes = {
  columnFilters: PropTypes.any.isRequired,
  setColumnFilters: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default Filters;
