import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  makeSelectToken,
  makeSelectUserRole,
} from "../../redux/slices/app/selector";
import {
  useGetStudentLevelsQuery,
  useCreateStudentLevelMutation,
  useDeleteStudentLevelMutation,
} from "../../redux/slices/students/api";
import { saveLevelsData } from "../../redux/slices/students";
import { makeSelectLevelsData } from "../../redux/slices/students/selector";
import {
  HStack,
  Button,
  Input,
  InputGroup,
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
  Text,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { createLevelSchema } from "../../utils/validationSchema";
import { FiSearch, FiPlus, FiDownload } from "react-icons/fi";
import useCustomToast from "../CustomToast";
import { exportToExcel } from "../../services/helper";

const Filters = ({ handleFilterChange }) => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const token = useSelector(makeSelectToken());
  const levels = useSelector(makeSelectLevelsData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, refetch } = useGetStudentLevelsQuery();
  const [createStudentLevel, { isLoading: createLevelIsLoading }] =
    useCreateStudentLevelMutation();
  const [deleteStudentLevel] = useDeleteStudentLevelMutation();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const applyFilters = () => {
    handleFilterChange({ name, status });
  };

  useEffect(() => {
    if (data?.data) {
      dispatch(saveLevelsData(data?.data));
    }
  }, [data]);

  const createLevelFormik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: createLevelSchema,
    onSubmit: (values, actions) => {
      handleCreateLevel(values, actions);
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateLevel = async (values, actions) => {
    try {
      const response = await createStudentLevel(values).unwrap();
      if (response?.success) {
        toast({
          title: "Student Level",
          description: "Successfully created level",
          status: "success",
        });

        actions.resetForm();
        refetch();
      }
    } catch (error) {
      toast({
        title: "Student Level",
        description: error?.data?.message,
        status: "error",
      });

      actions.resetForm();
    }
  };

  const handleDeleteLevel = async (id) => {
    try {
      const response = await deleteStudentLevel(id).unwrap();
      if (response?.success) {
        toast({
          title: "Student Level",
          description: "Successfully deleted level",
          status: "success",
        });

        refetch();
      }
    } catch (error) {
      toast({
        title: "Student Level",
        description: error?.data?.message,
        status: "error",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportToExcel(token);

      if (response.status === 200) {
        toast({
          title: "Students",
          description: response.message,
          status: "success",
        });
      }
    } catch (err) {
      toast({
        title: "Students",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
      gap={4}
      mb={6}
      alignItems={"center"}
    >
      <GridItem>
        <Flex direction={{ base: "column", md: "row" }} gap={4}>
          <InputGroup size={"sm"} mb={{ base: 4, md: 0 }}>
            <Input
              type="text"
              variant={"filled"}
              placeholder="Student Name"
              borderWidth={1.5}
              borderColor="gray"
              borderRadius="md"
              height="2.5rem"
              value={name}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <Select
            value={status}
            onChange={handleStatusChange}
            mb={{ base: 4, md: 0 }}
            borderColor="gray"
          >
            <option value="">Select Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending center">Pending Center</option>
            <option value="pending admin">Pending Admin</option>
          </Select>
        </Flex>
      </GridItem>
      <GridItem>
        <HStack
          spacing={3}
          direction={{ base: "column", md: "row" }}
          alignItems="center"
        >
          <Button
            colorScheme="orange"
            variant="solid"
            size="sm"
            leftIcon={<FiSearch />}
            onClick={applyFilters}
          >
            Search
          </Button>
          {role === "admin" && (
            <Button
              colorScheme="teal"
              variant="solid"
              size="sm"
              leftIcon={<FiPlus />}
              onClick={openModal}
            >
              New Level
            </Button>
          )}
          <Button
            colorScheme="blue"
            variant="solid"
            size="sm"
            leftIcon={<FiDownload />}
            onClick={handleExport}
          >
            Export
          </Button>
        </HStack>
      </GridItem>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex minH={"50vh"} justify={"center"} borderRadius={"xl"}>
              <Stack spacing={4} w={"100%"} p={6}>
                <Heading lineHeight={1.1} fontSize={{ base: "xl", sm: "2xl" }}>
                  Create New Level
                </Heading>
                <VStack
                  as="form"
                  mx="auto"
                  w="100%"
                  spacing={4}
                  justifyContent="center"
                  onSubmit={createLevelFormik.handleSubmit}
                >
                  <FormControl
                    isInvalid={
                      createLevelFormik.errors.name &&
                      createLevelFormik.touched.name
                    }
                  >
                    <FormLabel>Name</FormLabel>
                    <Flex w="100%" justifyContent="space-between">
                      <HStack w="100%" spacing={4}>
                        <Input
                          name="name"
                          placeholder="Level Name"
                          {...createLevelFormik.getFieldProps("name")}
                          flex="1"
                        />
                        <Button type="submit" colorScheme="green">
                          {createLevelIsLoading ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </HStack>
                    </Flex>
                    <FormErrorMessage>
                      {createLevelFormik.errors.name}
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
                <VStack align="start" w="100%" spacing={4} mt={4}>
                  {levels?.map((level) => (
                    <Flex
                      key={level.id}
                      w="100%"
                      justifyContent="space-between"
                    >
                      <Text>{level.name}</Text>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteLevel(level.id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  ))}
                </VStack>
              </Stack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

Filters.propTypes = {
  handleFilterChange: PropTypes.func.isRequired,
};

export default Filters;
