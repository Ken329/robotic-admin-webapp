import React, { useState, useEffect, useRef } from "react";
import {
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Layout from "../../components/Layout/MainLayout";
import ReactQuill, { Quill } from "react-quill";
import QuillResizeImage from "quill-resize-image";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import useCustomToast from "../../components/CustomToast";

Quill.register("modules/resize", QuillResizeImage);

const CreatePost = () => {
  const toast = useCustomToast();
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const quillRef = useRef(null);

  const post = () => {
    console.log(title);
    console.log(editorContent);
    console.log(coverImage);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    post();
  };

  const handleImageInsert = () => {
    try {
      if (imageUrl) {
        console.log(imageUrl);
        const quill = quillRef.current.getEditor();
        console.log(quill);
        const range = quill.getSelection();
        console.log(range);
        if (range) {
          quill.insertEmbed(range.index, "image", imageUrl);
        } else {
          quill.insertEmbed(quill.getLength() - 1, "image", imageUrl);
        }
        toast({
          title: "Create Post",
          description: `Image uploaded successfully`,
          status: "success",
        });

        setImageUrl("");
        onClose();
      }
    } catch (error) {
      toast({
        title: "Create Post",
        description: `Error uploading image: ${error}`,
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (title && editorContent && coverImage) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [editorContent, title, coverImage]);

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: onOpen,
      },
    },
    resize: {
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white",
      },
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  console.log(editorContent);

  return (
    <Layout isLoading={loading}>
      <Flex minH={"100vh"} gap={6} flexWrap={"wrap"}>
        <form onSubmit={handleSubmit} style={{ flex: "1 1 45%" }}>
          <Flex
            gap={6}
            boxShadow={"lg"}
            p={4}
            flexDir={"column"}
            width={"100%"}
          >
            <Heading textAlign={"center"}>Create Post</Heading>
            <FormControl isRequired>
              <FormLabel>Title:</FormLabel>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                placeholder="Post title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Cover Photo: (landscape)</FormLabel>
              <Input
                onChange={(e) => setCoverImage(e.target.files[0])}
                type="file"
                accept="image/*"
                name="cover image"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Content: </FormLabel>
              <ReactQuill
                ref={quillRef}
                modules={modules}
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
              />
            </FormControl>
            <Button type="submit" name="submit" disabled={isBtnDisabled}>
              Save
            </Button>
          </Flex>
        </form>
        <Flex
          p={4}
          flexDir={"column"}
          boxShadow={"lg"}
          style={{ flex: "1 1 45%" }}
          gap={3}
        >
          <Heading textAlign={"center"}>Preview</Heading>
          <Heading textAlign={"center"} fontSize="xl">
            {title}
          </Heading>
          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover"
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
          )}
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: editorContent }}
            style={{
              whiteSpace: "pre-wrap",
              padding: "10px",
              border: "1px solid #ddd",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Insert Image URL</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter the image URL"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleImageInsert}>
                Insert
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
