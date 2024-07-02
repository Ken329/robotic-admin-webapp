import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  HStack,
  VStack,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetAllFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../../redux/slices/posts/api";
import { makeSelectFilesData } from "../../redux/slices/posts/selector";
import { saveFilesData } from "../../redux/slices/posts";
import useCustomToast from "../../components/CustomToast";

const CoverImage = ({ onCoverImageSelect }) => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const images = useSelector(makeSelectFilesData());
  const [imageLoading, setImageLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const {
    data: imagesData,
    isLoading,
    isError,
    refetch,
  } = useGetAllFilesQuery({
    skip: !isOpen,
  });
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  useEffect(() => {
    if (imagesData && !isLoading && !isError) {
      dispatch(saveFilesData(imagesData?.data));
    } else if (isError) {
      toast({
        title: "Fetch Images",
        description: `Error fetching images`,
        status: "error",
      });
    }
  }, [imagesData, isLoading, isError]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setImageLoading(true);
      await uploadFile(formData).unwrap();
      toast({
        title: "Upload Image",
        description: "Image uploaded successfully",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Upload Image",
        description: `Error uploading image: ${error?.data?.message}`,
        status: "error",
      });
    } finally {
      setImageLoading(false);
      fileInputRef.current.value = null; // Reset file input
      refetch();
    }
  };

  const handleImageSelect = (image) => {
    onCoverImageSelect(image.url, image.id);
    onClose();
  };

  const handleImageDelete = async (fileId) => {
    try {
      await deleteFile(fileId).unwrap();
      toast({
        title: "Cover Image",
        description: "Image deleted successfully",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Cover Image",
        description: `Error deleting image: ${error?.data?.message}`,
        status: "error",
      });
    } finally {
      refetch();
    }
  };

  return (
    <>
      <Flex mb="10px">
        <Button colorScheme="blue" onClick={onOpen}>
          Select Cover Image
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="800px">
          <ModalHeader>Select Cover Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button onClick={() => fileInputRef.current.click()} mb="10px">
              Upload New Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            {imageLoading ? (
              <Flex justify="center" align="center">
                <Spinner />
                <Text ml="2">Loading...</Text>
              </Flex>
            ) : (
              <Flex wrap="wrap" gap={4}>
                {images.map((image) => (
                  <VStack
                    key={image.id}
                    spacing={2}
                    align="center"
                    p={2}
                    borderWidth={1}
                    borderRadius="md"
                  >
                    <Image src={image.url} alt={image.name} maxWidth="100px" />
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleImageSelect(image)}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleImageDelete(image.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

CoverImage.propTypes = {
  onCoverImageSelect: PropTypes.func.isRequired,
};

export default CoverImage;
