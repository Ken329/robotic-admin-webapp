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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiDownload } from "react-icons/fi";
import { categoryMap, USER_ROLE, POST_TYPE } from "../../utils/constants";
import { exportCompetitionToExcel } from "../../services/helper";
import useCustomToast from "../CustomToast";

const BlogCard = ({ blog, handleDelete }) => {
  const navigate = useNavigate();
  const toast = useCustomToast();
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

  const handleExportData = async () => {
    try {
      const response = await exportCompetitionToExcel(
        token,
        blog?.id,
        blog?.title
      );

      if (response.status === 200) {
        toast({
          title: "Competition",
          description: response.message,
          status: "success",
        });
      }
    } catch (err) {
      toast({
        title: "Competition",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleEditClick = () => {
    navigate(`/admin/createPost/${blog.id}`);
  };

  const handleDeleteClick = () => {
    onOpen();
  };

  return (
    <Card
      maxW="sm"
      w="100%"
      bg="white"
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

      <CardHeader p={0}>
        <Image
          src={blog?.url}
          alt={blog?.title}
          objectFit="cover"
          width="100%"
          height="250px"
          borderTopRadius="15px"
        />
      </CardHeader>

      <CardBody p="15px" m="0">
        <HStack pb={"10px"}>
          <Tag variant="solid" colorScheme={category.colorScheme}>
            {category.label}
          </Tag>
        </HStack>
        <VStack alignItems="flex-start">
          <Heading fontSize="xl">{blog?.title}</Heading>
          <Text fontSize="sm">{blog?.description}</Text>
        </VStack>
      </CardBody>

      <CardFooter p="15px" pt="0" m="0">
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <VStack align="start">
            <HStack wrap="wrap">
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
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
              color="gray.500"
            >
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
      </CardFooter>

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
    </Card>
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
