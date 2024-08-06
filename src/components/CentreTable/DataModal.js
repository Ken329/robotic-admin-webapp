import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  makeSelectToken,
  makeSelectUserRole,
} from "../../redux/slices/app/selector";
import { useUpdateCentreMutation } from "../../redux/slices/centre/api";
import { Formik, Field } from "formik";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Stack,
  Flex,
  VStack,
  HStack,
  Button,
  Spinner,
} from "@chakra-ui/react";
import useCustomToast from "../CustomToast";
import Spin from "../Spin";
import { getUserById } from "../../services/auth";
import { USER_ROLE, CENTRE_STATUS } from "../../utils/constants";

const DataModal = ({ isOpen, onClose, rowData }) => {
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const token = useSelector(makeSelectToken());
  const [centreData, setCentreData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [updateCentre, { isLoading: updateLoading }] =
    useUpdateCentreMutation();

  useEffect(() => {
    if (isOpen) {
      const fetchCentreData = async () => {
        setLoading(true);
        try {
          const response = await getUserById(rowData?.id, token);
          setCentreData(response);
        } catch (error) {
          toast({
            title: "Centre",
            description: error.message,
            status: "error",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchCentreData();
    }
  }, [rowData, isOpen]);

  const isReadOnly = useMemo(() => {
    if (
      role === USER_ROLE.ADMIN &&
      centreData?.status === CENTRE_STATUS.APPROVED &&
      isEdit
    ) {
      return false;
    }
    return true;
  }, [role, centreData, isEdit]);

  const handleUpdate = async (values) => {
    try {
      const payload = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== centreData[key]) {
          payload[key] = values[key];
        }
      });

      const response = await updateCentre({
        id: centreData.centerId,
        body: payload,
      }).unwrap();

      if (response.success) {
        toast({
          title: "Centre",
          description: response?.message,
          status: "success",
        });

        setIsEdit(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Centre",
        description: error?.data?.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex minH={"50vh"} justify={"center"} borderRadius={"xl"}>
            <Stack spacing={4} w={"100%"} p={6}>
              <Heading lineHeight={1.1} fontSize={{ base: "xl", sm: "2xl" }}>
                Centre Info
              </Heading>

              {loading ? (
                <Spin />
              ) : (
                <Formik
                  initialValues={{
                    name: centreData?.centerName || "",
                    location: centreData?.centerLocation || "",
                    email: centreData?.email || "",
                    id: centreData?.id || "",
                    status: centreData?.status || "",
                  }}
                  onSubmit={(values) => {
                    if (centreData?.status === CENTRE_STATUS.APPROVED) {
                      handleUpdate(values);
                    }
                  }}
                >
                  {({ handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={4} align="flex-start">
                        <FormControl
                          isInvalid={errors.name && touched.name}
                          w="100%"
                        >
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Field
                            as={Input}
                            id="name"
                            name="name"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.location && touched.location}
                          w="100%"
                        >
                          <FormLabel htmlFor="location">Location</FormLabel>
                          <Field
                            as={Input}
                            id="location"
                            name="location"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>{errors.location}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.email && touched.email}
                          w="100%"
                        >
                          <FormLabel htmlFor="email">Email ID</FormLabel>
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="text"
                            variant="filled"
                            isReadOnly={true}
                            disabled={!isReadOnly}
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.id && touched.id}
                          w="100%"
                        >
                          <FormLabel htmlFor="id">Centre ID</FormLabel>
                          <Field
                            as={Input}
                            id="id"
                            name="id"
                            type="text"
                            variant="filled"
                            isReadOnly={true}
                            disabled={!isReadOnly}
                          />
                          <FormErrorMessage>{errors.id}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.status && touched.status}
                          w="100%"
                        >
                          <FormLabel htmlFor="status">Status</FormLabel>
                          <Field
                            as={Input}
                            id="status"
                            name="status"
                            type="text"
                            variant="filled"
                            isReadOnly={true}
                            disabled={!isReadOnly}
                          />
                          <FormErrorMessage>{errors.status}</FormErrorMessage>
                        </FormControl>

                        {centreData?.status === CENTRE_STATUS.APPROVED &&
                          role === USER_ROLE.ADMIN && (
                            <>
                              {isEdit ? (
                                <HStack spacing={4} w={"100%"}>
                                  <Button type="submit" colorScheme="green">
                                    {updateLoading ? (
                                      <Spinner size="sm" color="white" />
                                    ) : (
                                      "Submit"
                                    )}
                                  </Button>
                                  <Button
                                    colorScheme="red"
                                    onClick={() => setIsEdit(false)}
                                  >
                                    Cancel
                                  </Button>
                                </HStack>
                              ) : (
                                <Button
                                  colorScheme="blue"
                                  onClick={() => setIsEdit(true)}
                                >
                                  Edit
                                </Button>
                              )}
                            </>
                          )}
                      </VStack>
                    </form>
                  )}
                </Formik>
              )}
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DataModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};

export default DataModal;
