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
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { createLevelSchema } from "../../utils/validationSchema";
import { FiSearch, FiPlus, FiDownload } from "react-icons/fi";
import FilterPopover from "./FilterPopover";
import useCustomToast from "../CustomToast";
import { exportToExcel } from "../../services/helper";

const Filters = ({ columnFilters, setColumnFilters }) => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const token = useSelector(makeSelectToken());
  const levels = useSelector(makeSelectLevelsData());
  const taskName = columnFilters.find((f) => f.id === "name")?.value || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, refetch } = useGetStudentLevelsQuery();
  const [createStudentLevel, { isLoading: createLevelIsLoading }] =
    useCreateStudentLevelMutation();
  const [deleteStudentLevel] = useDeleteStudentLevelMutation();

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
          description: "Sucessfully created level",
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
          placeholder="search student"
          borderWidth={1.5}
          borderColor="grey"
          value={taskName}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />
      </InputGroup>
      <FilterPopover
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      {role === "admin" && (
        <Flex gap={"10px"}>
          <Button
            colorScheme="teal"
            variant="solid"
            size="sm"
            leftIcon={<FiPlus />}
            onClick={openModal}
          >
            New Level
          </Button>
          <Button
            colorScheme="blue"
            variant="solid"
            size="sm"
            leftIcon={<FiDownload />}
            onClick={() => exportToExcel(token)}
          >
            Export
          </Button>
        </Flex>
      )}
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
    </HStack>
  );
};

Filters.propTypes = {
  columnFilters: PropTypes.any.isRequired,
  setColumnFilters: PropTypes.func.isRequired,
};

export default Filters;
