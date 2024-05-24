/* eslint-disable no-useless-escape */
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

const signUpSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  dob: Yup.string().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  center: Yup.string().required("Center is required"),
  nric: Yup.string().when("nationality", {
    is: (nationality) => nationality === "malaysia",
    then: (schema) =>
      schema
        .required("My Kad / NRIC is required")
        .matches(
          /^(?:\d{6}-\d{2}-\d{4}|\*{6}-\*{2}-\d{4})$/,
          "Invalid My Kad / NRIC"
        ),
    otherwise: (schema) => schema,
  }),
  passport: Yup.string().when("nationality", {
    is: (nationality) => nationality !== "malaysia",
    then: (schema) => schema.required("Passport is required"),
    otherwise: (schema) => schema,
  }),
  contact: Yup.string()
    .trim()
    .optional()
    .matches(
      /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/,
      "Invalid phone number. Please use a valid Malaysian phone number."
    ),
  race: Yup.string().required("Race is required"),
  moeEmail: Yup.string().optional().email("Invalid email address"),
  school: Yup.string().required("School is required"),
  nationality: Yup.string().required("Nationality is required"),
  parentName: Yup.string().required("Parent Name is required"),
  relationship: Yup.string().required(
    "Parent/Guardian relationship is required"
  ),
  parentEmail: Yup.string()
    .email("Invalid email address")
    .required("Parent email is required"),
  parentContact: Yup.string()
    .trim()
    .required("Parent contact number is required")
    .matches(
      /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/,
      "Invalid phone number. Please use a valid Malaysian phone number."
    ),
  size: Yup.string().required("T-Shirt size is required"),
  level: Yup.string().required("Level is required"),
});

const verifySchema = Yup.object().shape({
  code: Yup.string().required("otp is required"),
});

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "New password should be at least 6 characters")
    .required("New password is required"),
  otp: Yup.string().required("otp is required"),
});

const createCentreSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  location: Yup.string().required("Location is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

const createCentreAccountSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
  center: Yup.string().required("Centre ID is required"),
});

const createLevelSchema = Yup.object().shape({
  name: Yup.string().required("Level Name is required"),
});

export {
  loginSchema,
  signUpSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createCentreSchema,
  createCentreAccountSchema,
  createLevelSchema,
};
