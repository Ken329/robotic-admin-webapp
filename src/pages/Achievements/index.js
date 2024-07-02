import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Heading,
  Box,
  Grid,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Image,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  useGetAchievementListQuery,
  useCreateAchievementMutation,
  useDeleteAchievementMutation,
  useUpdateAchievementMutation,
} from "../../redux/slices/achievements/api";
import { saveAchievementsData } from "../../redux/slices/achievements";
import { makeSelectToken } from "../../redux/slices/app/selector";
import { makeSelectAchievementsData } from "../../redux/slices/achievements/selector";
import { getAchievementImage } from "../../services/helper";
import Layout from "../../components/Layout/MainLayout";
import ImageCrop from "../../components/ImageCrop";
import { dataURLtoFile, formatDate } from "../../utils/helper";
import useCustomToast from "../../components/CustomToast";

const Achievements = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const token = useSelector(makeSelectToken());
  const { data, isLoading, isError, refetch } = useGetAchievementListQuery();
  const achievements = useSelector(makeSelectAchievementsData());
  const [createAchievement] = useCreateAchievementMutation();
  const [deleteAchievement] = useDeleteAchievementMutation();
  const [updateAchievement] = useUpdateAchievementMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    const fetchImages = async (achievements) => {
      const updatedAchievements = await Promise.all(
        achievements?.map(async (achievement) => {
          const imageUrl = achievement?.imageUrl;
          try {
            const imageBlob = await getAchievementImage(imageUrl, token);
            const imageObjectURL = URL.createObjectURL(imageBlob);
            return { ...achievement, imageUrl: imageObjectURL };
          } catch (error) {
            toast({
              title: "Achievements",
              description: `Error fetching image: ${error}`,
              status: "error",
            });

            return achievement;
          }
        })
      );
      dispatch(saveAchievementsData(updatedAchievements));
    };

    if (!isLoading && !isError && data?.data) {
      fetchImages(data?.data);
    } else if (!isLoading && !isError && data) {
      dispatch(saveAchievementsData(null));
    } else if (isError) {
      toast({
        title: "Achievements",
        description: "Error getting achievement list",
        status: "error",
      });
    }
  }, [data, isLoading, isError]);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedImageDataURL) => {
    const croppedImageFile = dataURLtoFile(croppedImageDataURL, image.name);
    setCroppedImage(croppedImageFile);
    setImagePreview(URL.createObjectURL(croppedImageFile));
    setShowCropModal(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", croppedImage);

    try {
      if (selectedAchievement) {
        const updateAchievementPayload = {
          id: selectedAchievement.id,
          formData: formData,
        };

        const response = await updateAchievement(updateAchievementPayload);

        if (response?.data?.success) {
          toast({
            title: "Achievements",
            description: response?.data?.message,
            status: "success",
          });
        }
      } else {
        const response = await createAchievement({
          formData,
        }).unwrap();

        if (response?.success) {
          toast({
            title: "Achievements",
            description: response?.message,
            status: "success",
          });
        }
      }
      const refetchedData = await refetch();
      if (refetchedData.data) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Achievements",
        description: `Failed to create achievement`,
        status: "error",
      });
    }
  };

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    setTitle(achievement?.title);
    setDescription(achievement?.description);
    setImage(null);
    setCroppedImage(null);
    setImagePreview(achievement?.imageUrl);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteAchievement(id).unwrap();
      if (response?.success) {
        toast({
          title: "Achievements",
          description: response?.message,
          status: "success",
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Achievements",
        description: error?.data?.message,
        status: "error",
      });
    }
  };

  return (
    <Layout isLoading={isLoading}>
      <Flex flexDirection={"column"} paddingLeft={"20px"}>
        <Box p={5}>
          <Heading as="h2" size="lg" mb="4">
            Achievements
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
            <Box
              onClick={() => {
                setSelectedAchievement(null);
                setTitle("");
                setDescription("");
                setImage(null);
                setCroppedImage(null);
                setImagePreview(null);
                onOpen();
              }}
              p={5}
              border="3px dashed grey"
              borderRadius="md"
              bg="white"
              cursor="pointer"
              textAlign="center"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
              position="relative"
            >
              <Text fontWeight="bold">+ New Achievement</Text>
            </Box>
            {achievements?.map((achievement, index) => (
              <Box
                key={index}
                p={5}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                textAlign="center"
                bg="white"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
                position="relative"
                boxShadow="md"
              >
                {achievement.imageUrl && (
                  <Box m="5px">
                    <Image
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                )}
                <Text fontSize="lg" mb={2} fontWeight="bold">
                  {achievement.title}
                </Text>
                <Text fontSize="sm" mb={2}>
                  {achievement.description}
                </Text>
                <Text
                  fontSize={{
                    base: "xs",
                    md: "sm",
                    lg: "sm",
                  }}
                  color="gray.500"
                >
                  {formatDate(achievement?.createdAt) || ""}
                </Text>
                <Flex
                  display="flex"
                  position="absolute"
                  top="5px"
                  right="10px"
                  justifyContent="space-between"
                  width="70px"
                  maxWidth="70px"
                  opacity="0"
                  _hover={{ opacity: "1" }}
                >
                  <IconButton
                    aria-label="Edit Achievement"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleEdit(achievement)}
                  />
                  <IconButton
                    aria-label="Delete Achievement"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(achievement.id)}
                  />
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedAchievement
                ? "Edit Achievement"
                : "Create New Achievement"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {imagePreview && (
                  <Box mt={2}>
                    <FormLabel>Preview</FormLabel>
                    <Image
                      src={imagePreview}
                      alt="Current Image"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <ImageCrop
          open={showCropModal}
          image={image}
          onComplete={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      </Flex>
    </Layout>
  );
};

export default Achievements;
