import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import BlogCard from "./BlogCard";

const sortBlogs = (blogs, sortBy) => {
  const sortedBlogs = [...blogs];
  switch (sortBy) {
    case "newest":
      return sortedBlogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    case "oldest":
      return sortedBlogs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case "mostViewed":
      return sortedBlogs.sort((a, b) => b.views - a.views);
    default:
      return sortedBlogs;
  }
};

const BlogList = ({ blogs, handleDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAndFilteredBlogs = sortBlogs(filteredBlogs, sortBy);

  return (
    <Box m={{ base: "5%", md: "5%", lg: "2%" }}>
      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        mb={4}
        gap={4}
      >
        <InputGroup flex="1" bg="white" borderRadius="md" boxShadow="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            bg="white"
            border="none"
            _focus={{ boxShadow: "outline" }}
          />
        </InputGroup>
        <Select
          onChange={handleCategoryChange}
          bg="white"
          flex="1"
          borderRadius="md"
          boxShadow="sm"
          _focus={{ boxShadow: "outline" }}
        >
          <option value="all">All</option>
          {[...new Set(blogs.map((blog) => blog.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Select
          onChange={handleSortChange}
          bg="white"
          flex="1"
          borderRadius="md"
          boxShadow="sm"
          _focus={{ boxShadow: "outline" }}
          value={sortBy}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostViewed">Most Viewed</option>
        </Select>
      </Flex>
      <Heading as="h3" size="lg" mb="10px">
        Latest Posts
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={5}>
        {sortedAndFilteredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} handleDelete={handleDelete} />
        ))}
      </SimpleGrid>
      {sortedAndFilteredBlogs.length === 0 && <Text>None</Text>}
    </Box>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
};

BlogList.defaultProps = {
  blogs: [],
};

export default BlogList;
