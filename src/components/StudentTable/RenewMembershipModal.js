import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeSelectToken } from "../../redux/slices/app/selector";
import {
  //  useRenewMembershipMutation,
  useExpireStudentAccountMutation,
} from "../../redux/slices/students/api";
import { getUserById } from "../../services/auth";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import useCustomToast from "../CustomToast";
import Spin from "../Spin";

const RenewMembershipModal = ({ isOpen, onClose, rowData }) => {
  // const [renewMembership] = useRenewMembershipMutation();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  const token = useSelector(makeSelectToken());
  const currentYear = new Date().getFullYear();
  const [expireStudentAccount] = useExpireStudentAccountMutation();

  const toast = useCustomToast();

  const isRenewed = (expiryDate) => {
    const expiryYear = new Date(expiryDate).getFullYear();

    return currentYear === expiryYear;
  };

  useEffect(() => {
    if (studentData) {
      console.log(studentData?.expiryDate);
    }
  }, [studentData]);

  const handleRenewMembership = async (id) => {
    try {
      const response = await expireStudentAccount(id).unwrap();
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Renew Membership</ModalHeader>
        <ModalCloseButton />
        {loading ? (
          <Spin />
        ) : studentData.expiryDate && !isRenewed(studentData.expiryDate) ? (
          <Box m={2}>
            <ModalBody>
              This account has already renewed their membership for this year (
              {currentYear}).
            </ModalBody>
          </Box>
        ) : (
          <>
            <ModalBody>
              Do you want to renew membership for this student account? This
              action cannot be undone. The account status will be set to
              &quot;Expired&quot;.
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
          </>
        )}
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
