import React, { useEffect, useRef, useState } from 'react';

import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure
} from '@chakra-ui/react';

import 'react-quill/dist/quill.snow.css';

import parse from 'html-react-parser';
import QuillResizeImage from 'quill-resize-image';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';

import CoverImage from './CoverImage';
import useCustomToast from '../../components/CustomToast';
import Layout from '../../components/Layout/MainLayout';
import {
  useCreatePostMutation,
  useGetAllBlogTypesQuery,
  useGetAllCategoriesQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation
} from '../../redux/slices/posts/api';
import { useGetStudentLevelsQuery } from '../../redux/slices/students/api';
import { POST_ATTRIBUTE_TYPES } from '../../utils/constants';

Quill.register('modules/resize', QuillResizeImage);

const CreatePost = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const quillRef = useRef(null);

  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState('');
  const [blogType, setBlogType] = useState('');
  const [category, setCategory] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [sendTo, setSendTo] = useState(['All']);
  const [sendToOptions, setSendToOptions] = useState([]);
  const [blogTypes, setBlogTypes] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [initialCoverImage, setInitialCoverImage] = useState('');
  const [checkboxLabel, setCheckboxLabel] = useState('');
  const [customCheckboxes, setCustomCheckboxes] = useState([]);
  const [textInputLabel, setTextInputLabel] = useState('');
  const [customTextInputs, setCustomTextInputs] = useState([]);
  const [includeTeamMember, setIncludeTeamMember] = useState(false);

  const { data: blogTypeData } = useGetAllBlogTypesQuery();
  const { data: blogCategoryData } = useGetAllCategoriesQuery();
  const { data: studentLevels } = useGetStudentLevelsQuery();
  const { data: postData, isSuccess: isPostLoaded } = useGetPostByIdQuery(id, {
    skip: !isEditMode,
    refetchOnMountOrArgChange: true
  });
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    if (blogTypeData) setBlogTypes(blogTypeData.data);
    if (blogCategoryData) setBlogCategories(blogCategoryData.data);
  }, [blogTypeData, blogCategoryData]);

  useEffect(() => {
    if (studentLevels) {
      setSendToOptions(['All', ...studentLevels.data.map(level => level.name)]);
    }
  }, [studentLevels]);

  useEffect(() => {
    if (isPostLoaded && postData.success) {
      const post = postData.data;

      setTitle(post.title);
      setDescription(post.description);
      setCategory(post.category);
      setBlogType(post.type);
      setEditorContent(post.content);
      setSendTo(post.assigned.split(', '));
      setInitialCoverImage(post.url);
      setCoverImage({ url: post.url });

      if (post.customAttributes) {
        const checkboxes = post.customAttributes.filter(
          attr => attr.type === POST_ATTRIBUTE_TYPES.CHECKBOX
        );
        const textInputs = post.customAttributes.filter(
          attr => attr.type === POST_ATTRIBUTE_TYPES.TEXT_INPUT
        );

        const hasTeamMember = post.customAttributes.some(
          attr => attr.category === POST_ATTRIBUTE_TYPES.TEAM_MEMBER
        );

        setCustomCheckboxes(checkboxes);
        setCustomTextInputs(textInputs);
        setIncludeTeamMember(hasTeamMember);
      }
    }
  }, [postData, isPostLoaded]);

  const validatePostData = () => {
    if (
      !title ||
      !editorContent ||
      !(coverImage || initialCoverImage) ||
      !blogType ||
      !category ||
      !description ||
      sendTo.length === 0
    ) {
      return false;
    }

    if (category === 'competition' && customCheckboxes.length === 0) {
      return false;
    }

    return true;
  };

  const handleSendToChange = value => {
    setSendTo(value.includes('All') ? ['All'] : value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (!validatePostData()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        status: 'error'
      });
      setLoading(false);

      return;
    }

    const postPayload = {
      title,
      description,
      category,
      type: blogType,
      assigned: sendTo.join(', '),
      content: editorContent
    };

    if (category === 'competition') {
      postPayload.customAttributes = [
        ...customCheckboxes,
        ...customTextInputs,
        ...(includeTeamMember ? [{ category: POST_ATTRIBUTE_TYPES.TEAM_MEMBER }] : [])
      ];
    }

    if (coverImage && coverImage.fileId) {
      postPayload.coverImage = coverImage.fileId;
    }

    try {
      if (isEditMode) {
        await updatePost({ id, ...postPayload }).unwrap();
        toast({
          title: 'Post Updated',
          description: 'Your post has been updated successfully.',
          status: 'success'
        });
      } else {
        await createPost(postPayload).unwrap();
        toast({
          title: 'Post Created',
          description: 'Your post has been created successfully.',
          status: 'success'
        });
      }

      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: `There was an error ${isEditMode ? 'updating' : 'creating'} the post.`,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageInsert = () => {
    try {
      if (imageUrl) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        if (range) {
          quill.insertEmbed(range.index, 'image', imageUrl);
        } else {
          quill.insertEmbed(quill.getLength() - 1, 'image', imageUrl);
        }
        toast({
          title: 'Create Post',
          description: 'Image uploaded successfully',
          status: 'success'
        });

        setImageUrl('');
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Create Post',
        description: `Error uploading image: ${error}`,
        status: 'error'
      });
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: onOpen }
    },
    resize: {
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white'
      },
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  const handleCoverImageSelect = (url, fileId) => {
    setCoverImage({ url, fileId });
  };

  const handleAddCheckbox = () => {
    if (checkboxLabel.trim()) {
      setCustomCheckboxes([
        ...customCheckboxes,
        { category: checkboxLabel, type: POST_ATTRIBUTE_TYPES.CHECKBOX }
      ]);
      setCheckboxLabel('');
    } else {
      toast({
        title: 'Create Post',
        description: 'Checkbox label name cannot be empty.',
        status: 'error'
      });
    }
  };

  const handleAddTextInput = () => {
    if (textInputLabel.trim()) {
      setCustomTextInputs([
        ...customTextInputs,
        { category: textInputLabel, type: POST_ATTRIBUTE_TYPES.TEXT_INPUT }
      ]);
      setTextInputLabel('');
    } else {
      toast({
        title: 'Create Post',
        description: 'Text Input label name cannot be empty.',
        status: 'error'
      });
    }
  };

  const handleRemoveCheckbox = index => {
    const newCheckboxes = [...customCheckboxes];

    newCheckboxes.splice(index, 1);
    setCustomCheckboxes(newCheckboxes);
  };

  const handleRemoveTextInput = index => {
    const newTextInputs = [...customTextInputs];

    newTextInputs.splice(index, 1);
    setCustomTextInputs(newTextInputs);
  };

  const handleTeamMemberToggle = () => {
    setIncludeTeamMember(prev => !prev);
  };

  return (
    <Layout isLoading={loading}>
      <Flex minH="100vh" gap={6} flexWrap="wrap">
        <form onSubmit={handleSubmit} style={{ flex: '1 1 45%' }}>
          <Flex gap={6} boxShadow="lg" p={4} flexDir="column" width="100%">
            <Heading textAlign="center">{isEditMode ? 'Edit Post' : 'Create Post'}</Heading>
            <FormControl isRequired>
              <FormLabel>Title:</FormLabel>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text"
                placeholder="Post title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Cover Photo: (landscape)</FormLabel>
              <CoverImage onCoverImageSelect={handleCoverImageSelect} />
              {(coverImage || initialCoverImage) && (
                <Box width="100%" height="300px" overflow="hidden" mb={2}>
                  <img
                    src={(coverImage && coverImage.url) || initialCoverImage}
                    alt="Cover"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description:</FormLabel>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                type="text"
                placeholder="Post description"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type:</FormLabel>
              <Select
                value={blogType}
                placeholder="Post type"
                onChange={e => setBlogType(e.target.value)}
              >
                {blogTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Category:</FormLabel>
              <Select
                value={category}
                placeholder="Post category"
                onChange={e => setCategory(e.target.value)}
              >
                {blogCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Send To:</FormLabel>
              <CheckboxGroup value={sendTo} onChange={handleSendToChange}>
                <Flex flexWrap="wrap" gap={4}>
                  {sendToOptions.map(option => (
                    <Checkbox key={option} value={option}>
                      {option}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Content:</FormLabel>
              <ReactQuill
                ref={quillRef}
                value={editorContent}
                onChange={setEditorContent}
                theme="snow"
                modules={modules}
                style={{ minHeight: '300px' }}
              />
            </FormControl>

            {category === 'competition' && (
              <>
                <Text>
                  To add remark, add this line at the end of your content.
                  <br /> {`{remark: YOUR TEXT}`}
                </Text>

                <FormControl mb={4}>
                  <FormLabel>Custom Checkbox</FormLabel>
                  <Flex>
                    <Input
                      placeholder="Enter label name"
                      value={checkboxLabel}
                      onChange={e => setCheckboxLabel(e.target.value)}
                      mr={2}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      onClick={handleAddCheckbox}
                      colorScheme="blue"
                      aria-label="Add checkbox"
                    />
                  </Flex>
                </FormControl>

                {customCheckboxes.map((checkbox, index) => (
                  <Flex key={index} alignItems="center" mb={2}>
                    <Checkbox mr={2} isReadOnly>
                      {checkbox.category}
                    </Checkbox>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleRemoveCheckbox(index)}
                      aria-label="Remove checkbox"
                      size="sm"
                    />
                  </Flex>
                ))}

                <FormControl mb={4}>
                  <FormLabel>Custom Text Input</FormLabel>
                  <Flex>
                    <Input
                      placeholder="Enter label name"
                      value={textInputLabel}
                      onChange={e => setTextInputLabel(e.target.value)}
                      mr={2}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      onClick={handleAddTextInput}
                      colorScheme="blue"
                      aria-label="Add text input"
                    />
                  </Flex>
                </FormControl>

                {customTextInputs.map((textInput, index) => (
                  <>
                    <FormControl mb={4}>
                      <FormLabel>{textInput.category}</FormLabel>
                      <Flex>
                        <Input
                          value={null}
                          placeholder={`Enter ${textInput.category}`}
                          isReadOnly
                          mr={2}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleRemoveTextInput(index)}
                          aria-label="Remove textInput"
                          size="sm"
                        />
                      </Flex>
                    </FormControl>
                  </>
                ))}

                <Checkbox
                  key="Team-Member-Selection"
                  isChecked={includeTeamMember}
                  onChange={handleTeamMemberToggle}
                >
                  Include Team Member Selection?
                </Checkbox>
              </>
            )}

            <Button type="submit" colorScheme="blue" isFullWidth>
              {isEditMode ? 'Update Post' : 'Create Post'}
            </Button>
          </Flex>
        </form>

        {/* Preview Section */}
        <Flex flexDir="column" flex="1 1 45%" boxShadow="lg" p={4}>
          <Heading textAlign="center">Preview</Heading>
          <Box mb={4}>
            {(coverImage || initialCoverImage) && (
              <Box width="100%" height="300px" overflow="hidden" mb={2}>
                <img
                  src={(coverImage && coverImage.url) || initialCoverImage}
                  alt="Cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
          </Box>
          <Box>
            <Heading size="lg" mb={4}>
              {title}
            </Heading>
            <Text mb={4}>
              <strong>Description:</strong> {description}
            </Text>
            <Text mb={4}>
              <strong>Category:</strong> {category}
            </Text>
            <Text mb={4}>
              <strong>Type:</strong> {blogType}
            </Text>
            <Box className="ql-editor">{parse(`${editorContent}`)}</Box>
          </Box>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Image URL</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Image URL:</FormLabel>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="Enter the image URL"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleImageInsert}>
                Insert Image
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Layout>
  );
};

export default CreatePost;
