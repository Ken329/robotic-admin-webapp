import React from 'react';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import parse from 'html-react-parser';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import Layout from '@components/Layout/MainLayout';
import useGetPost from '@pages/Post/hook/useGetPost';
import { POST_TYPE } from '@utils/constants';

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { blog, isLoading, isError, remark } = useGetPost(id);

  return (
    <Layout isLoading={isLoading}>
      <Container maxW="container.md" p={0}>
        <Button
          leftIcon={<ArrowBackIcon />}
          color="#27374d"
          variant="link"
          onClick={() => navigate('/admin/dashboard')}
          mb="4"
        >
          Back to Dashboard
        </Button>

        {isError ? (
          <Box
            w="100%"
            bg="white"
            p="10"
            borderRadius="15px"
            boxShadow="lg"
            textAlign="center"
            minH="300px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading fontSize="3xl">404 Not Found</Heading>
            <Text color="gray.500" mt="4">
              Oops, the page you are looking for does not exist.
            </Text>
          </Box>
        ) : (
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
              <Text fontSize={{ base: 'xs', md: 'md', lg: 'md' }} color="gray.500">
                By
              </Text>
              <Text fontSize={{ base: 'xs', md: 'md', lg: 'md' }} color="#27374d" fontWeight="600">
                Admin
              </Text>
              <Text fontSize={{ base: 'xs', md: 'md', lg: 'md' }} color="gray.500">
                • {new Date(blog?.createdAt).toLocaleDateString()} • {blog?.views} views
              </Text>
            </HStack>

            <Box height="auto" width="100%" overflow="hidden" borderRadius="xl" mb="4">
              <Image
                src={blog?.url}
                alt={blog?.title}
                objectFit="cover"
                width="100%"
                height="auto"
              />
            </Box>
            <VStack spacing="2" alignItems="flex-start" mb="4">
              <Heading
                fontSize={{
                  base: 'xl',
                  md: '2xl'
                }}
              >
                {blog?.title}
              </Heading>
            </VStack>
            <Box className="ql-editor">{parse(`${blog?.content}`)}</Box>
            <Box marginTop="30px">
              {blog?.category === POST_TYPE.COMPETITION && (
                <VStack spacing="5" mb="30px">
                  {blog?.customAttributes?.map((attribute, index) => {
                    if (attribute.type === 'checkbox') {
                      return (
                        <FormControl key={index}>
                          <Checkbox isChecked={false} isReadOnly>
                            {attribute.category}
                          </Checkbox>
                        </FormControl>
                      );
                    }

                    if (attribute.type === 'textInput') {
                      return (
                        <FormControl key={index}>
                          <FormLabel>{attribute.category}</FormLabel>
                          <Input placeholder={`Enter ${attribute.category}`} isReadOnly />
                        </FormControl>
                      );
                    }

                    if (attribute.type === 'Team Member' || attribute.category === 'Team Member') {
                      return (
                        <FormControl key={index}>
                          <FormLabel>
                            {attribute.category} {remark && `(${remark})`}
                          </FormLabel>
                          <Select
                            placeholder="Select team member"
                            isSearchable
                            isClearable
                            isDisabled
                          />
                        </FormControl>
                      );
                    }

                    return (
                      <FormControl key={index}>
                        <Checkbox isReadOnly>{attribute.category}</Checkbox>
                      </FormControl>
                    );
                  })}
                </VStack>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Post;
