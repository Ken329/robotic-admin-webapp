import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import {
  makeSelectUserRole,
  makeSelectToken,
} from "../../redux/slices/app/selector";
import {
  Box,
  Image,
  Heading,
  Text,
  HStack,
  Tag,
  Button,
  Flex,
  VStack,
  Spacer,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiDownload } from "react-icons/fi";
import { categoryMap, USER_ROLE, POST_TYPE } from "../../utils/constants";
import { exportCompetitionToExcel } from "../../services/helper";

const BlogCard = ({ blog, handleDelete }) => {
  const navigate = useNavigate();
  const role = useSelector(makeSelectUserRole());
  const token = useSelector(makeSelectToken());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const category = categoryMap[blog.category] || {
    label: blog.category,
    colorScheme: "gray",
  };

  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), {
    addSuffix: true,
  });

  const handleExportData = () => {
    exportCompetitionToExcel(token, blog?.id, blog?.title);
  };

  const handleEditClick = () => {
    navigate(`/admin/createPost/${blog.id}`);
  };

  const handleDeleteClick = () => {
    onOpen();
  };

  return (
    <Box
      maxW="sm"
      w="100%"
      bg="white"
      p="6"
      borderRadius="15px"
      boxShadow="md"
      overflow="hidden"
      position="relative"
    >
      {role === USER_ROLE.ADMIN && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          display="flex"
          flexDirection="row"
          alignItems="flex-end"
          gap="2"
          opacity="0"
          _hover={{ opacity: "1" }}
        >
          {blog?.category === POST_TYPE.COMPETITION && (
            <IconButton
              size="sm"
              colorScheme="blue"
              aria-label="Export Data"
              icon={<FiDownload />}
              onClick={handleExportData}
              Export
            />
          )}
          <IconButton
            size="sm"
            colorScheme="blue"
            aria-label="Edit blog"
            icon={<EditIcon />}
            onClick={handleEditClick}
          />
          <IconButton
            size="sm"
            colorScheme="red"
            aria-label="Delete blog"
            icon={<DeleteIcon />}
            onClick={handleDeleteClick}
          />
        </Box>
      )}
      <Box
        height="250px"
        width="100%"
        overflow="hidden"
        borderRadius="xl"
        mb="4"
      >
        <Image
          src={blog?.url}
          alt={blog?.title}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      <HStack mb="2">
        <Tag variant="solid" colorScheme={category.colorScheme}>
          {category.label}
        </Tag>
      </HStack>
      <VStack spacing="2" alignItems="flex-start" mb="2">
        <Heading fontSize="xl">{blog?.title}</Heading>
        <Text fontSize="sm">{blog?.description}</Text>
      </VStack>

      <Flex justifyContent="space-between" alignItems="center" mt="auto">
        <VStack align="start" spacing="1">
          <HStack spacing="1" wrap="wrap">
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
              color="gray.500"
            >
              By
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
              color="#27374d"
              fontWeight="600"
            >
              Admin
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
              color="gray.500"
            >
              • {timeAgo}
            </Text>
          </HStack>
          <Text fontSize={{ base: "xs", md: "sm", lg: "sm" }} color="gray.500">
            {blog?.views} views
          </Text>
        </VStack>
        <Spacer />
        <Button
          size={{ base: "xs", md: "sm", lg: "sm" }}
          colorScheme="blue"
          onClick={() => navigate(`/admin/post/${blog?.id}`)}
        >
          Read More
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                if (handleDelete) {
                  handleDelete(blog?.id);
                  onClose();
                }
              }}
              ml={3}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    views: PropTypes.number,
    createdAt: PropTypes.string,
  }).isRequired,
  handleDelete: PropTypes.func,
};

export default BlogCard;
