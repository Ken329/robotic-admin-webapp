import React from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text
} from '@chakra-ui/react';

import PropTypes from 'prop-types';

import BlogCard from './BlogCard';
import useBlogFilter from './hook/useBlogFilter';

const BlogList = ({ blogs, handleDelete }) => {
  const {
    selectedCategory,
    searchQuery,
    sortBy,
    sortedBlogs,
    setSelectedCategory,
    setSearchQuery,
    setSortBy
  } = useBlogFilter(blogs);

  return (
    <Box m={{ base: '5%', md: '5%', lg: '2%' }}>
      <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" mb={4} gap={4}>
        <InputGroup flex="1" bg="white" borderRadius="md" boxShadow="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            bg="white"
            border="none"
            _focus={{ boxShadow: 'outline' }}
          />
        </InputGroup>
        <Flex gap={4}>
          <Select
            onChange={e => setSelectedCategory(e.target.value)}
            bg="white"
            flex="1"
            borderRadius="md"
            boxShadow="sm"
            _focus={{ boxShadow: 'outline' }}
            value={selectedCategory}
          >
            <option value="all">All</option>
            <option value="general">General</option>
            <option value="exercise">Exercise</option>
            <option value="competition">Competition</option>
          </Select>
          <Select
            onChange={e => setSortBy(e.target.value)}
            bg="white"
            flex="1"
            borderRadius="md"
            boxShadow="sm"
            _focus={{ boxShadow: 'outline' }}
            value={sortBy}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostViewed">Most Viewed</option>
          </Select>
        </Flex>
      </Flex>
      <Heading as="h3" size="lg" mb="10px">
        Latest Posts
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {sortedBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} handleDelete={handleDelete} />
        ))}
      </SimpleGrid>
      {sortedBlogs.length === 0 && <Text>None</Text>}
    </Box>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleDelete: PropTypes.func
};

BlogList.defaultProps = {
  blogs: []
};

export default BlogList;
