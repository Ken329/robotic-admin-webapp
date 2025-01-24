import React from "react";
import PropTypes from "prop-types";
import { useRenewMembershipMutation } from "../../redux/slices/students/api";
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

const RenewMembershipModal = ({ isOpen, onClose, rowData }) => {
  const [renewMembership] = useRenewMembershipMutation();

  const toast = useCustomToast();

  const handleRenewMembership = async (id) => {
    try {
      const response = await renewMembership(id).unwrap();
      if (response?.success) {
        toast({
          title: "Student",
          description: "Successfully renewed membership",
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
        <ModalHeader>Renew Membership</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Do you want to renew membership for this student account? This action
          cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              handleRenewMembership(rowData?.id);
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

RenewMembershipModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};

export default RenewMembershipModal;
