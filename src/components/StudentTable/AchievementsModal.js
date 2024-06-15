import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useGetAchievementListQuery,
  useAssignAchievementMutation,
  useGetAssignedAchievementsQuery,
} from "../../redux/slices/achievements/api";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import useCustomToast from "../CustomToast";
import Spin from "../Spin";

const AchievementsModal = ({ isOpen, onClose, rowData }) => {
  const { data } = useGetAchievementListQuery();
  const { data: userAchievements, refetch } = useGetAssignedAchievementsQuery(
    rowData?.studentId,
    {
      skip: !isOpen,
    }
  );
  const toast = useCustomToast();
  const [assignAchievement] = useAssignAchievementMutation();
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data?.data) {
      setAchievements(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (userAchievements) {
      const userAssignedAchievements = userAchievements.data;

      setSelectedAchievements(
        userAssignedAchievements.map((a) => a.achievementId)
      );
      setLoading(false);
    }
  }, [userAchievements]);

  const handleCheckboxChange = (achievementId) => {
    setSelectedAchievements((prevSelected) =>
      prevSelected.includes(achievementId)
        ? prevSelected.filter((id) => id !== achievementId)
        : [...prevSelected, achievementId]
    );
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: rowData?.studentId,
        achievementIds: selectedAchievements,
      };

      const response = await assignAchievement(payload);

      if (response?.data?.success) {
        toast({
          title: "Achievement(s)",
          description: "Successfully assigned achievement(s)",
          status: "success",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Achievement(s)",
        description: error,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Achievements</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spin />
          ) : (
            <Box>
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <Checkbox
                    margin="10px"
                    key={achievement.id}
                    isChecked={selectedAchievements.includes(achievement.id)}
                    onChange={() => handleCheckboxChange(achievement.id)}
                  >
                    {achievement.title}
                  </Checkbox>
                ))
              ) : (
                <Text>No available achievements to add.</Text>
              )}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AchievementsModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};

export default AchievementsModal;
