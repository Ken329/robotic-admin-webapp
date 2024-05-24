import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
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
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { createLevelSchema } from "../../utils/validationSchema";
import { createNewLevel, getLevel, deleteLevel } from "../../services/auth";
import { FiSearch, FiPlus } from "react-icons/fi";
import FilterPopover from "./FilterPopover";

const Filters = ({ columnFilters, setColumnFilters }) => {
  const taskName = columnFilters.find((f) => f.id === "fullName")?.value || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const role = useSelector(makeSelectUserRole());

  console.log(levels);

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchLevels = async () => {
    try {
      const centerData = await getLevel();
      setLevels(centerData);
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    fetchLevels();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateLevel = async (values, actions) => {
    setLoading(true);
    try {
      const response = await createNewLevel(values, token?.accessToken);
      if (response?.success) {
        setLoading(false);
        closeModal();
        toast.success("Sucessfully created level");
        actions.resetForm();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error);
      actions.resetForm();
    }
  };

  const handleDeleteLevel = async (id) => {
    try {
      await deleteLevel(id, token?.accessToken);
      setLevels((prev) => prev.filter((level) => level.id !== id));
      toast.success("Successfully deleted level");
    } catch (error) {
      toast.error(error.message);
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
          onChange={(e) => onFilterChange("fullName", e.target.value)}
        />
      </InputGroup>
      <FilterPopover
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
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
                          {loading ? (
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
                  {levels.map((level) => (
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
