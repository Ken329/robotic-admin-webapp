import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeSelectUserRole } from "../../redux/slices/app/selector";
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
  Button,
  Heading,
  HStack,
  Stack,
  Flex,
  Grid,
  VStack,
  Spinner,
  Tooltip,
  Icon,
  Select,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  useApproveStudentMutation,
  useRejectStudentMutation,
} from "../../redux/slices/app/api";
import Spin from "../Spin";
import { getUserById, getLevel } from "../../services/auth";
import { signUpSchema } from "../../utils/validationSchema";

const DataModal = ({ isOpen, onClose, rowData }) => {
  const role = useSelector(makeSelectUserRole());
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);

  const token = JSON.parse(localStorage.getItem("token"));

  const [approveStudent, { isLoading: approveLoading }] =
    useApproveStudentMutation();
  const [rejectStudent, { isLoading: rejectLoading }] =
    useRejectStudentMutation();

  const fetchLevels = async () => {
    try {
      const response = await getLevel();
      setLevels(response);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApprove = async (values) => {
    try {
      const payload = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== studentData[key]) {
          payload[key] = values[key];
        }
      });

      const response = await approveStudent({
        id: studentData.id,
        body: payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectStudent({
        id: studentData.id,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const isReadOnly = useMemo(() => {
    if (role === "admin") {
      return studentData?.status !== "pending admin";
    } else if (role === "center") {
      return studentData?.status !== "pending center";
    }
    return true;
  }, [role, studentData?.status]);

  useEffect(() => {
    if (isOpen) {
      const fetchStudentData = async () => {
        setLoading(true);
        fetchLevels();
        try {
          const response = await getUserById(rowData?.id, token?.accessToken);
          setStudentData(response);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [rowData, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex minH={"100vh"} justify={"center"} borderRadius={"xl"}>
            <Stack spacing={4} w={"100%"} p={6}>
              <Heading lineHeight={1.1} fontSize={{ base: "xl", sm: "2xl" }}>
                Student Info
              </Heading>
              {loading ? (
                <Spin />
              ) : (
                <Formik
                  initialValues={{
                    fullName: studentData?.fullName || "",
                    dob: studentData?.dob || "",
                    gender: studentData?.gender || "",
                    center: studentData?.centerName || "",
                    nric: studentData?.nric || "",
                    passport: studentData?.passport || "",
                    contact: studentData?.contact || "",
                    race: studentData?.race || "",
                    moeEmail: studentData?.moeEmail || "",
                    school: studentData?.school || "",
                    nationality: studentData?.nationality || "",
                    parentName: studentData?.parentName || "",
                    relationship: studentData?.relationship || "",
                    parentEmail: studentData?.parentEmail || "",
                    parentContact: studentData?.parentContact || "",
                    size: studentData?.size || "",
                    level: studentData?.level || "",
                  }}
                  onSubmit={(values) => {
                    handleApprove(values);
                  }}
                  validationSchema={signUpSchema}
                >
                  {({ handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={4} align="flex-start">
                        <FormControl
                          isInvalid={errors.fullName && touched.fullName}
                          w="100%"
                        >
                          <FormLabel htmlFor="fullName">Full Name</FormLabel>
                          <Field
                            as={Input}
                            id="fullName"
                            name="fullName"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                        </FormControl>

                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                          <FormControl
                            isInvalid={errors.race && touched.race}
                            w="100%"
                          >
                            <FormLabel htmlFor="race">
                              Race
                              <Tooltip label="Options: Malay/Indian/Chinese/Others">
                                <Icon
                                  as={InfoOutlineIcon}
                                  ml={"5px"}
                                  color={"orange"}
                                />
                              </Tooltip>
                            </FormLabel>
                            <Field
                              as={Input}
                              id="race"
                              name="race"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>{errors.race}</FormErrorMessage>
                          </FormControl>

                          <FormControl
                            isInvalid={
                              errors.nationality && touched.nationality
                            }
                            w="100%"
                          >
                            <FormLabel htmlFor="nationality">
                              Nationality
                              <Tooltip label="Options: malaysia/others">
                                <Icon
                                  as={InfoOutlineIcon}
                                  ml={"5px"}
                                  color={"orange"}
                                />
                              </Tooltip>
                            </FormLabel>
                            <Field
                              as={Input}
                              id="nationality"
                              name="nationality"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>
                              {errors.nationality}
                            </FormErrorMessage>
                          </FormControl>
                        </Grid>

                        {studentData?.nationality === "malaysia" ? (
                          <FormControl
                            isInvalid={errors.nric && touched.nric}
                            w="100%"
                          >
                            <FormLabel htmlFor="nric">My Kad / Nric</FormLabel>
                            <Field
                              as={Input}
                              id="nric"
                              name="nric"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>{errors.nric}</FormErrorMessage>
                          </FormControl>
                        ) : (
                          <FormControl
                            isInvalid={errors.passport && touched.passport}
                            w="100%"
                          >
                            <FormLabel htmlFor="passport">Passport</FormLabel>
                            <Field
                              as={Input}
                              id="passport"
                              name="passport"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>
                              {errors.passport}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                          <FormControl
                            isInvalid={errors.gender && touched.gender}
                            w="100%"
                          >
                            <FormLabel htmlFor="gender">Gender</FormLabel>
                            <Field
                              as={Input}
                              id="gender"
                              name="gender"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>{errors.gender}</FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={errors.dob && touched.dob}
                            w="100%"
                          >
                            <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                            <Field
                              as={Input}
                              id="dob"
                              name="dob"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>{errors.dob}</FormErrorMessage>
                          </FormControl>
                        </Grid>

                        <FormControl
                          isInvalid={errors.school && touched.school}
                          w="100%"
                        >
                          <FormLabel htmlFor="school">School</FormLabel>
                          <Field
                            as={Input}
                            id="school"
                            name="school"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>{errors.school}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.moeEmail && touched.moeEmail}
                          w="100%"
                        >
                          <FormLabel htmlFor="moeEmail">MOE Email</FormLabel>
                          <Field
                            as={Input}
                            id="moeEmail"
                            name="moeEmail"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>{errors.moeEmail}</FormErrorMessage>
                        </FormControl>

                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                          <FormControl
                            isInvalid={errors.contact && touched.contact}
                            w="100%"
                          >
                            <FormLabel htmlFor="contact">
                              Contact Number
                            </FormLabel>
                            <Field
                              as={Input}
                              id="contact"
                              name="contact"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>
                              {errors.contact}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl
                            isInvalid={errors.size && touched.size}
                            w="100%"
                          >
                            <FormLabel htmlFor="size">T-Shirt Size</FormLabel>
                            <Field
                              as={Input}
                              id="size"
                              name="size"
                              type="text"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            />
                            <FormErrorMessage>{errors.size}</FormErrorMessage>
                          </FormControl>
                        </Grid>

                        <FormControl
                          isInvalid={errors.center && touched.center}
                          w="100%"
                        >
                          <FormLabel htmlFor="center">Centre</FormLabel>
                          <Field
                            as={Input}
                            id="center"
                            name="center"
                            type="text"
                            variant="filled"
                            isReadOnly={true}
                          />
                          <FormErrorMessage>{errors.center}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.level && touched.level}
                          w="100%"
                        >
                          <FormLabel htmlFor="level">Student Level</FormLabel>
                          <Field
                            as={Select}
                            id="level"
                            name="level"
                            placeholder="Select Student Level"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          >
                            {levels &&
                              levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                  {level.name}
                                </option>
                              ))}
                          </Field>

                          <FormErrorMessage>{errors.level}</FormErrorMessage>
                        </FormControl>
                        <Heading
                          lineHeight={1.1}
                          fontSize={{ base: "xl", sm: "2xl" }}
                          marginTop={"10px"}
                        >
                          Parent Info
                        </Heading>
                        <FormControl
                          isInvalid={errors.parentName && touched.parentName}
                          w="100%"
                        >
                          <FormLabel htmlFor="parentName">Name</FormLabel>
                          <Field
                            as={Input}
                            id="parentName"
                            name="parentName"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.parentName}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            errors.relationship && touched.relationship
                          }
                          w="100%"
                        >
                          <FormLabel htmlFor="relationship">
                            Relationship to student
                            <Tooltip label="Options: father/mother/others">
                              <Icon
                                as={InfoOutlineIcon}
                                ml={"5px"}
                                color={"orange"}
                              />
                            </Tooltip>
                          </FormLabel>
                          <Field
                            as={Input}
                            id="relationship"
                            name="relationship"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.relationship}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={errors.parentEmail && touched.parentEmail}
                          w="100%"
                        >
                          <FormLabel htmlFor="parentEmail">Email</FormLabel>
                          <Field
                            as={Input}
                            id="parentEmail"
                            name="parentEmail"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.parentEmail}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            errors.parentContact && touched.parentContact
                          }
                          w="100%"
                        >
                          <FormLabel htmlFor="parentContact">
                            Contact Number
                          </FormLabel>
                          <Field
                            as={Input}
                            id="parentContact"
                            name="parentContact"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.parentContact}
                          </FormErrorMessage>
                        </FormControl>

                        {!isReadOnly && (
                          <Flex>
                            <HStack spacing={4} w={"100%"}>
                              <Button type="submit" colorScheme="green">
                                {approveLoading ? (
                                  <Spinner size="sm" color="white" />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                              <Button colorScheme="red" onClick={handleReject}>
                                {rejectLoading ? (
                                  <Spinner size="sm" color="white" />
                                ) : (
                                  "Reject"
                                )}
                              </Button>
                            </HStack>
                          </Flex>
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
