import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdQuery } from "../../redux/slices/posts/api";
import {
  Box,
  Image,
  Heading,
  Text,
  HStack,
  VStack,
  Container,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Select from "react-select";
import { ArrowBackIcon } from "@chakra-ui/icons";
import useCustomToast from "../../components/CustomToast";
import Layout from "../../components/Layout/MainLayout";
import { POST_TYPE } from "../../utils/constants";

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useCustomToast();
  const { data, isLoading, isError } = useGetPostByIdQuery(id);
  const [blog, setBlog] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setBlog(data.data);

      let content = data.data.content || "";
      const remarkMatch = content.match(/\{remark:\s*([^}]+)\}/);
      if (remarkMatch) {
        setRemark(remarkMatch[1]);
        content = content.replace(remarkMatch[0], "");
        setBlog((prevBlog) => ({
          ...prevBlog,
          content: content,
        }));
      }
    } else if (isError) {
      toast({
        title: "Posts",
        description: "Error getting post",
        status: "error",
      });
    }
  }, [data, isLoading, isError]);

  return (
    <Layout isLoading={isLoading}>
      <Container maxW="container.md">
        <Button
          onClick={() => navigate("/admin/dashboard")}
          leftIcon={<ArrowBackIcon />}
          mb="4"
        >
          Back to Dashboard
        </Button>
        <Box
          maxW="full"
          w="100%"
          bg="white"
          p="6"
          borderRadius="15px"
          boxShadow="md"
          overflow="hidden"
        >
          <HStack align="start" spacing="1" mb="10px">
            <Text
              fontSize={{ base: "xs", md: "md", lg: "md" }}
              color="gray.500"
            >
              By
            </Text>
            <Text
              fontSize={{ base: "xs", md: "md", lg: "md" }}
              color="#27374d"
              fontWeight="600"
            >
              Admin
            </Text>
            <Text
              fontSize={{ base: "xs", md: "md", lg: "md" }}
              color="gray.500"
            >
              • {new Date(blog?.createdAt).toLocaleDateString()} • {blog?.views}{" "}
              views
            </Text>
          </HStack>

          <Box
            height="auto"
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
              height="auto"
            />
          </Box>
          <VStack spacing="2" alignItems="flex-start" mb="4">
            <Heading fontSize="2xl">{blog?.title}</Heading>
          </VStack>
          <Box className="ql-editor">{parse(`${blog?.content}`)}</Box>
          {blog?.category === POST_TYPE.COMPETITION && (
            <VStack marginTop="30px">
              <VStack align="start" spacing="5" mb="30px">
                {blog?.customAttributes?.map((attribute, index) => {
                  if (attribute.category === "Team Member") {
                    return (
                      <FormControl key={index}>
                        <FormLabel>
                          {attribute.category} {remark && `(${remark})`}
                        </FormLabel>
                        <Select
                          placeholder="Select team member"
                          isSearchable
                          isClearable
                          isDisabled={true}
                        />
                      </FormControl>
                    );
                  } else {
                    return (
                      <Checkbox key={index} isReadOnly={true}>
                        {attribute.category}
                      </Checkbox>
                    );
                  }
                })}
              </VStack>
            </VStack>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Post;
