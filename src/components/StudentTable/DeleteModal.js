import React from "react";
import PropTypes from "prop-types";
import { useDeleteStudentMutation } from "../../redux/slices/students/api";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import useCustomToast from "../CustomToast";

const DeleteModal = ({ isOpen, onClose, rowData }) => {
  const [deleteStudent] = useDeleteStudentMutation();

  const toast = useCustomToast();

  const handleDeleteStudent = async (id) => {
    try {
      const response = await deleteStudent(id).unwrap();
      if (response?.success) {
        toast({
          title: "Student",
          description: "Successfully deleted student",
          status: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Student",
        description: error?.data?.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Student</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Do you want to delete this student account? This action cannot be
          undone.
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              handleDeleteStudent(rowData?.id);
              onClose();
            }}
            ml={3}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};

export default DeleteModal;
