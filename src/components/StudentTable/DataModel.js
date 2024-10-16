import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  makeSelectToken,
  makeSelectUserRole,
} from "../../redux/slices/app/selector";
import { makeSelectLevelsData } from "../../redux/slices/students/selector";
import {
  useApproveStudentMutation,
  useRejectStudentMutation,
  useUpdateStudentMutation,
  useGetStudentLevelsQuery,
} from "../../redux/slices/students/api";
import { saveLevelsData } from "../../redux/slices/students";
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
  Stack,
  HStack,
  Flex,
  Grid,
  VStack,
  Spinner,
  Select,
} from "@chakra-ui/react";
import Spin from "../Spin";
import { getUserById } from "../../services/auth";
import { createSignUpSchema } from "../../utils/validationSchema";
import { USER_ROLE, STUDENT_STATUS } from "../../utils/constants";
import useCustomToast from "../CustomToast";

const DataModal = ({ isOpen, onClose, rowData }) => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const role = useSelector(makeSelectUserRole());
  const token = useSelector(makeSelectToken());
  const levels = useSelector(makeSelectLevelsData());
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const { data } = useGetStudentLevelsQuery();

  const signUpSchema = createSignUpSchema(role);

  const [approveStudent, { isLoading: approveLoading }] =
    useApproveStudentMutation();
  const [rejectStudent, { isLoading: rejectLoading }] =
    useRejectStudentMutation();
  const [updateStudent, { isLoading: updateLoading }] =
    useUpdateStudentMutation();

  useEffect(() => {
    if (data?.data) {
      dispatch(saveLevelsData(data?.data));
    }
  }, [data]);

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
      }).unwrap();

      if (response.success) {
        toast({
          title: "Student",
          description: response?.message,
          status: "success",
        });

        onClose();
      }
    } catch (error) {
      toast({
        title: "Student",
        description: error?.data?.message,
        status: "error",
      });
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectStudent({
        id: studentData.id,
      });

      if (response.data.success) {
        toast({
          title: "Student",
          description: response?.data?.message,
          status: "success",
        });

        onClose();
      }
    } catch (error) {
      toast({
        title: "Student",
        description: error,
        status: "error",
      });
    }
  };

  const handleUpdate = async (values) => {
    try {
      const payload = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== studentData[key]) {
          payload[key] = values[key];
        }
      });

      const response = await updateStudent({
        id: studentData.id,
        body: payload,
      });

      if (response.data.success) {
        toast({
          title: "Student",
          description: response?.data?.message,
          status: "success",
        });

        setIsEdit(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Student",
        description: error?.message,
        status: "error",
      });
    }
  };

  const isReadOnly = useMemo(() => {
    if (
      role === USER_ROLE.ADMIN &&
      studentData?.status === STUDENT_STATUS.PENDING_ADMIN
    ) {
      return false;
    } else if (
      role === USER_ROLE.CENTER &&
      studentData?.status === STUDENT_STATUS.PENDING_CENTER
    ) {
      return false;
    } else if (
      role === USER_ROLE.ADMIN &&
      studentData?.status === STUDENT_STATUS.APPROVED &&
      isEdit
    ) {
      return false;
    } else {
      return true;
    }
  }, [role, studentData?.status, isEdit]);

  useEffect(() => {
    if (isOpen) {
      const fetchStudentData = async () => {
        setLoading(true);
        try {
          const response = await getUserById(rowData?.id, token);
          setStudentData(response);
        } catch (error) {
          toast({
            title: "Student",
            description: error?.message,
            status: "error",
          });
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
                    personalEmail: studentData?.personalEmail || "",
                    school: studentData?.school || "",
                    nationality: studentData?.nationality || "",
                    parentName: studentData?.parentName || "",
                    relationship: studentData?.relationship || "",
                    parentEmail: studentData?.parentEmail || "",
                    parentContact: studentData?.parentContact || "",
                    size: studentData?.size || "",
                    level: studentData?.level || "",
                    roboticId: studentData?.roboticId || "",
                    joinedDate: studentData?.joinedDate || "",
                  }}
                  onSubmit={(values) => {
                    if (studentData?.status === STUDENT_STATUS.APPROVED) {
                      handleUpdate(values);
                    } else {
                      handleApprove(values);
                    }
                  }}
                  validationSchema={signUpSchema}
                >
                  {({ handleSubmit, values, errors, touched }) => (
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
                            <FormLabel htmlFor="race">Race</FormLabel>
                            <Field
                              as={Select}
                              id="race"
                              name="race"
                              placeholder="Select Student race"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            >
                              <option value="Malay">Malay</option>
                              <option value="Chinese">Chinese</option>
                              <option value="Indian">Indian</option>
                              <option value="Others">Others</option>
                            </Field>

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
                            </FormLabel>
                            <Field
                              as={Select}
                              id="nationality"
                              name="nationality"
                              placeholder="Select student nationality"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            >
                              <option value="malaysia">Malaysian</option>
                              <option value="others">Others</option>
                            </Field>
                            <FormErrorMessage>
                              {errors.nationality}
                            </FormErrorMessage>
                          </FormControl>
                        </Grid>

                        {values.nationality === "malaysia" ? (
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
                              as={Select}
                              id="gender"
                              name="gender"
                              placeholder="Select student gender"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </Field>
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

                        <FormControl
                          isInvalid={
                            errors.personalEmail && touched.personalEmail
                          }
                          w="100%"
                        >
                          <FormLabel htmlFor="personalEmail">
                            Personal Email
                          </FormLabel>
                          <Field
                            as={Input}
                            id="personalEmail"
                            name="personalEmail"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.personalEmail}
                          </FormErrorMessage>
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
                              as={Select}
                              id="size"
                              name="size"
                              placeholder="Select T-Shirt size"
                              variant="filled"
                              isReadOnly={isReadOnly}
                            >
                              <option value="4XS">4XS</option>
                              <option value="3XS">3XS</option>
                              <option value="2XS">2XS</option>
                              <option value="XS">XS</option>
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                            </Field>
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
                          isInvalid={errors.joinedDate && touched.joinedDate}
                          w="100%"
                        >
                          <FormLabel htmlFor="joinedDate">
                            Joined Date
                          </FormLabel>
                          <Field
                            as={Input}
                            id="joinedDate"
                            name="joinedDate"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />
                          <FormErrorMessage>
                            {errors.joinedDate}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={errors.roboticId && touched.roboticId}
                          w="100%"
                        >
                          <FormLabel htmlFor="roboticId">Student ID</FormLabel>
                          <Field
                            as={Input}
                            id="roboticId"
                            name="roboticId"
                            type="text"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          />

                          <FormErrorMessage>
                            {errors.roboticId}
                          </FormErrorMessage>
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
                          </FormLabel>
                          <Field
                            as={Select}
                            id="relationship"
                            name="relationship"
                            placeholder="Select relationship to student"
                            variant="filled"
                            isReadOnly={isReadOnly}
                          >
                            <option value="father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="others">Legal Guardian</option>
                          </Field>
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

                        {studentData?.status === STUDENT_STATUS.APPROVED &&
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
                        {studentData?.status !== STUDENT_STATUS.APPROVED &&
                          studentData?.status !== STUDENT_STATUS.REJECTED &&
                          !isReadOnly && (
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
